import React from 'react';
import { View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import Screen from '../shared/Screen';

export default function AddEditPropertyScreen({ route, navigation }: any) {
  const editing = Boolean(route.params?.propertyId);
  return (
    <Screen>
      <ScreenHeader title={editing ? 'Edit property' : 'Add property'} subtitle="UI-only form. TODO: connect to landlord property APIs." />
      <AppInput label="Title" placeholder="Modern 2BHK apartment" />
      <AppInput label="Description" placeholder="Describe the property" multiline style={{ minHeight: 92, textAlignVertical: 'top' }} />
      <AppInput label="Address" placeholder="Street and locality" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppInput label="City" placeholder="Bengaluru" style={{ flex: 1 }} />
        <AppInput label="State" placeholder="Karnataka" style={{ flex: 1 }} />
      </View>
      <AppInput label="Pincode" placeholder="560001" keyboardType="number-pad" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppInput label="Rent" placeholder="32000" keyboardType="number-pad" style={{ flex: 1 }} />
        <AppInput label="Deposit" placeholder="90000" keyboardType="number-pad" style={{ flex: 1 }} />
      </View>
      <AppInput label="Property type" placeholder="2BHK" />
      <AppInput label="Furnishing" placeholder="semi_furnished" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppInput label="Bedrooms" placeholder="2" keyboardType="number-pad" style={{ flex: 1 }} />
        <AppInput label="Bathrooms" placeholder="2" keyboardType="number-pad" style={{ flex: 1 }} />
      </View>
      <AppInput label="Amenities" placeholder="Lift, Security, Balcony" />
      <AppInput label="Image URL" placeholder="https://example.com/home.jpg" />
      <AppButton title={editing ? 'Save changes' : 'Create property'} />
      <AppButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
