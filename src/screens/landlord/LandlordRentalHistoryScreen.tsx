import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { RentalHistoryCard } from '../../components/RentalHistoryCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { createReviewRequest } from '../../services/reviewRequests/reviewRequestApi';
import { createReview } from '../../services/reviews/reviewApi';
import { getLandlordRentalHistories, updateRentalHistory } from '../../services/rentalHistories/rentalHistoryApi';
import { colors } from '../../theme/colors';
import type { RentalHistory, RentalStatus } from '../../types';
import { toUiRentalHistory } from '../../types/rentalHistory';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';
import { ModalSheet } from '../shared/ModalSheet';

const initialReview = { rating: '5', title: '', comment: '', tags: '' };

export default function LandlordRentalHistoryScreen() {
  const [rentals, setRentals] = useState<RentalHistory[]>([]);
  const [selected, setSelected] = useState<RentalHistory | null>(null);
  const [reviewForm, setReviewForm] = useState(initialReview);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRentals = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await getLandlordRentalHistories();
      setRentals(data.map(item => toUiRentalHistory(item, 'tenant')));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load rental histories.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRentals();
  }, [loadRentals]);

  const changeStatus = async (rental: RentalHistory, status: RentalStatus) => {
    setSubmittingId(rental.id);
    setError('');
    setSuccess('');
    try {
      await updateRentalHistory(rental.id, { status });
      setSuccess(`Rental marked ${status}.`);
      await loadRentals(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update rental status.'));
    } finally {
      setSubmittingId('');
    }
  };

  const submitReview = async () => {
    if (!selected) return;
    const rating = Number(reviewForm.rating);
    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      setFormError('Rating must be between 1 and 5.');
      return;
    }
    setSubmittingId(selected.id);
    setFormError('');
    try {
      await createReview({
        rentalHistoryId: selected.id,
        rating,
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
        tags: reviewForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });
      setSelected(null);
      setReviewForm(initialReview);
      setSuccess('Review submitted successfully.');
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to submit review.'));
    } finally {
      setSubmittingId('');
    }
  };

  const requestReview = async (rental: RentalHistory) => {
    setSubmittingId(rental.id);
    setError('');
    setSuccess('');
    try {
      await createReviewRequest({
        rentalHistoryId: rental.id,
        message: 'Please review my rental experience.',
      });
      setSuccess('Review request sent.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to request review.'));
    } finally {
      setSubmittingId('');
    }
  };

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadRentals(true)} />}>
      <ScreenHeader title="Rental history" subtitle="Manage active and completed rentals." />
      {success ? <Text style={{ color: colors.trust, fontWeight: '800' }}>{success}</Text> : null}
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? <EmptyState title="Could not load rentals" message={error} actionLabel="Retry" onAction={() => loadRentals()} /> : null}
      {!loading && !error && rentals.length === 0 ? <EmptyState title="No rental history yet" message="Create rental histories from approved tenant requests." /> : null}
      {!loading && !error ? rentals.map(item => (
        <React.Fragment key={item.id}>
          <RentalHistoryCard
            rental={item}
            counterpartyLabel="Tenant"
            actionsDisabled={submittingId === item.id}
            onReview={() => setSelected(item)}
            onRequestReview={() => requestReview(item)}
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['active', 'completed', 'terminated'] as RentalStatus[]).map(status => (
              <AppButton key={status} title={status} onPress={() => changeStatus(item, status)} disabled={submittingId === item.id || item.status === status} variant={item.status === status ? 'secondary' : 'ghost'} style={{ flex: 1 }} />
            ))}
          </View>
        </React.Fragment>
      )) : null}
      <ModalSheet visible={Boolean(selected)} title="Review tenant" onClose={() => setSelected(null)}>
        <AppInput label="Rating" value={reviewForm.rating} onChangeText={value => setReviewForm(current => ({ ...current, rating: value }))} placeholder="1-5" keyboardType="number-pad" />
        <AppInput label="Title" value={reviewForm.title} onChangeText={value => setReviewForm(current => ({ ...current, title: value }))} placeholder="Reliable tenant" />
        <AppInput label="Comment" value={reviewForm.comment} onChangeText={value => setReviewForm(current => ({ ...current, comment: value }))} placeholder="Share details" multiline style={{ minHeight: 90, textAlignVertical: 'top' }} />
        <AppInput label="Tags" value={reviewForm.tags} onChangeText={value => setReviewForm(current => ({ ...current, tags: value }))} placeholder="On-time rent, Clean, Respectful" />
        {formError ? <Text style={{ color: colors.danger }}>{formError}</Text> : null}
        <AppButton title={submittingId ? 'Submitting...' : 'Submit review'} onPress={submitReview} disabled={Boolean(submittingId)} />
      </ModalSheet>
    </Screen>
  );
}
