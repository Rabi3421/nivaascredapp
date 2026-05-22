import React, { useState } from 'react';
import { Text } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { ReviewCard } from '../../components/ReviewCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { reviews } from '../../data/mockData';
import Screen from '../shared/Screen';
import { ModalSheet } from '../shared/ModalSheet';

export default function TenantReviewsScreen() {
  const [open, setOpen] = useState(false);
  return (
    <Screen>
      <ScreenHeader title="Reviews" subtitle="Received, given, and requested reviews." />
      <SectionHeader title="Received" />
      {reviews.slice(0, 1).map(item => <ReviewCard key={item.id} review={item} />)}
      <SectionHeader title="Given" />
      {reviews.slice(1).map(item => <ReviewCard key={item.id} review={item} />)}
      <SectionHeader title="Requests received" />
      <Text>Please review Priya Sharma for Bright 2BHK near Metro.</Text>
      <AppButton title="Write review" onPress={() => setOpen(true)} />
      <ModalSheet visible={open} title="Write review" onClose={() => setOpen(false)}>
        <AppInput label="Rating" placeholder="1-5" keyboardType="number-pad" />
        <AppInput label="Title" placeholder="Good experience" />
        <AppInput label="Comment" placeholder="Share details" multiline style={{ minHeight: 90, textAlignVertical: 'top' }} />
        <AppButton title="Submit review" onPress={() => setOpen(false)} />
      </ModalSheet>
    </Screen>
  );
}
