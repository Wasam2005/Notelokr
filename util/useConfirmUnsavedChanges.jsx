import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { BackHandler } from 'react-native';

export function useConfirmUnsavedChanges(hasUnsavedChanges, showModal) {
  const latestUnsavedChanges = useRef(false);

  latestUnsavedChanges.current = hasUnsavedChanges;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        console.log('Back button pressed, hasUnsavedChanges:', latestUnsavedChanges.current);

        if (latestUnsavedChanges.current) {
          showModal();
          return true;
        }

        return false;
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [showModal])
  );
}

