import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Review } from '../types';
import { colors } from '../theme/colors';
import { AppCard } from './AppCard';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{review.title}</Text>
        <Text style={styles.rating}>{review.rating}/5</Text>
      </View>
      <Text style={styles.meta}>From {review.from} - {review.propertyTitle}</Text>
      <Text style={styles.comment}>{review.comment}</Text>
      <View style={styles.tags}>
        {review.tags.map(tag => <Text key={tag} style={styles.tag}>{tag}</Text>)}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '800' },
  rating: { color: colors.warning, fontWeight: '900' },
  meta: { color: colors.muted, fontSize: 13 },
  comment: { color: colors.text, lineHeight: 20 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { color: colors.primary, backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontSize: 12, fontWeight: '700' },
});
