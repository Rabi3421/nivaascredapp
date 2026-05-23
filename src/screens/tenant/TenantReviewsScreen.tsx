import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ReviewCard } from '../../components/ReviewCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { getReviewRequests, updateReviewRequestStatus } from '../../services/reviewRequests/reviewRequestApi';
import { createReview, getGivenReviews, getReceivedReviews } from '../../services/reviews/reviewApi';
import { colors } from '../../theme/colors';
import type { Review } from '../../types';
import type { UiReviewRequest } from '../../types/reviewRequest';
import { toUiReviewRequest } from '../../types/reviewRequest';
import { toUiReview } from '../../types/review';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';
import { ModalSheet } from '../shared/ModalSheet';

const initialReview = { rating: '5', title: '', comment: '', tags: '' };

export default function TenantReviewsScreen() {
  const [received, setReceived] = useState<Review[]>([]);
  const [given, setGiven] = useState<Review[]>([]);
  const [requests, setRequests] = useState<UiReviewRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<UiReviewRequest | null>(null);
  const [reviewForm, setReviewForm] = useState(initialReview);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadReviews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const [receivedData, givenData, requestData] = await Promise.all([
        getReceivedReviews(),
        getGivenReviews(),
        getReviewRequests(),
      ]);
      setReceived(receivedData.map(item => toUiReview(item, 'received')));
      setGiven(givenData.map(item => toUiReview(item, 'given')));
      setRequests(requestData.map(toUiReviewRequest));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load reviews.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const submitReview = async () => {
    if (!selectedRequest) return;
    const rating = Number(reviewForm.rating);
    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      setFormError('Rating must be between 1 and 5.');
      return;
    }
    setSubmittingId(selectedRequest.id);
    setFormError('');
    try {
      await createReview({
        rentalHistoryId: selectedRequest.rentalHistoryId,
        rating,
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
        tags: reviewForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });
      setSelectedRequest(null);
      setReviewForm(initialReview);
      await loadReviews(true);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to submit review.'));
    } finally {
      setSubmittingId('');
    }
  };

  const updateRequest = async (request: UiReviewRequest, status: 'completed' | 'declined') => {
    setSubmittingId(request.id);
    setError('');
    try {
      await updateReviewRequestStatus(request.id, { status });
      await loadReviews(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update review request.'));
    } finally {
      setSubmittingId('');
    }
  };

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadReviews(true)} />}>
      <ScreenHeader title="Reviews" subtitle="Received, given, and requested reviews." />
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? <EmptyState title="Could not load reviews" message={error} actionLabel="Retry" onAction={() => loadReviews()} /> : null}
      {!loading && !error ? (
        <>
          <SectionHeader title="Received" />
          {received.length === 0 ? <EmptyState title="No reviews received" message="Reviews from landlords will appear here." /> : received.map(item => <ReviewCard key={item.id} review={item} />)}
          <SectionHeader title="Given" />
          {given.length === 0 ? <EmptyState title="No reviews given" message="Reviews you write will appear here." /> : given.map(item => <ReviewCard key={item.id} review={item} />)}
          <SectionHeader title="Requests received" />
          {requests.length === 0 ? <EmptyState title="No review requests" message="Requests from landlords will appear here." /> : requests.map(request => (
            <View key={request.id} style={{ gap: 8 }}>
              <Text style={{ color: colors.text, lineHeight: 22 }}>
                {request.requesterName} requested a review for {request.propertyTitle} ({request.status}).
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <AppButton title="Write review" onPress={() => setSelectedRequest(request)} disabled={submittingId === request.id || request.status !== 'pending'} style={{ flex: 1 }} />
                <AppButton title="Decline" variant="ghost" onPress={() => updateRequest(request, 'declined')} disabled={submittingId === request.id || request.status !== 'pending'} style={{ flex: 1 }} />
              </View>
            </View>
          ))}
        </>
      ) : null}
      <ModalSheet visible={Boolean(selectedRequest)} title="Write review" onClose={() => setSelectedRequest(null)}>
        <AppInput label="Rating" value={reviewForm.rating} onChangeText={value => setReviewForm(current => ({ ...current, rating: value }))} placeholder="1-5" keyboardType="number-pad" />
        <AppInput label="Title" value={reviewForm.title} onChangeText={value => setReviewForm(current => ({ ...current, title: value }))} placeholder="Good experience" />
        <AppInput label="Comment" value={reviewForm.comment} onChangeText={value => setReviewForm(current => ({ ...current, comment: value }))} placeholder="Share details" multiline style={{ minHeight: 90, textAlignVertical: 'top' }} />
        <AppInput label="Tags" value={reviewForm.tags} onChangeText={value => setReviewForm(current => ({ ...current, tags: value }))} placeholder="Respectful, Clean" />
        {formError ? <Text style={{ color: colors.danger }}>{formError}</Text> : null}
        <AppButton title={submittingId ? 'Submitting...' : 'Submit review'} onPress={submitReview} disabled={Boolean(submittingId)} />
      </ModalSheet>
    </Screen>
  );
}
