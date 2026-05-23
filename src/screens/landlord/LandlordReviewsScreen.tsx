import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ReviewCard } from '../../components/ReviewCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { getReviewRequests, updateReviewRequestStatus } from '../../services/reviewRequests/reviewRequestApi';
import { getGivenReviews, getReceivedReviews } from '../../services/reviews/reviewApi';
import { colors } from '../../theme/colors';
import type { Review } from '../../types';
import type { UiReviewRequest } from '../../types/reviewRequest';
import { toUiReviewRequest } from '../../types/reviewRequest';
import { toUiReview } from '../../types/review';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';

export default function LandlordReviewsScreen() {
  const [received, setReceived] = useState<Review[]>([]);
  const [given, setGiven] = useState<Review[]>([]);
  const [requests, setRequests] = useState<UiReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState('');
  const [error, setError] = useState('');

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
          {received.length === 0 ? <EmptyState title="No reviews received" message="Reviews from tenants will appear here." /> : received.map(item => <ReviewCard key={item.id} review={item} />)}
          <SectionHeader title="Given" />
          {given.length === 0 ? <EmptyState title="No reviews given" message="Reviews you write will appear here." /> : given.map(item => <ReviewCard key={item.id} review={item} />)}
          <SectionHeader title="Requests" />
          {requests.length === 0 ? <EmptyState title="No review requests" message="Requests from tenants will appear here." /> : requests.map(request => (
            <View key={request.id} style={{ gap: 8 }}>
              <Text style={{ color: colors.text }}>{request.requesterName} requested a review for {request.propertyTitle} ({request.status}).</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <AppButton title="Mark completed" onPress={() => updateRequest(request, 'completed')} disabled={submittingId === request.id || request.status !== 'pending'} variant="outline" style={{ flex: 1 }} />
                <AppButton title="Decline" onPress={() => updateRequest(request, 'declined')} disabled={submittingId === request.id || request.status !== 'pending'} variant="ghost" style={{ flex: 1 }} />
              </View>
            </View>
          ))}
        </>
      ) : null}
    </Screen>
  );
}
