import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ReadMoreTextProps {
  text: string;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

export const ReadMoreText = ({ text, numberOfLines = 2, style }: ReadMoreTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  if (!text) return null;

  return (
    <View>
      <Text 
        style={style} 
        numberOfLines={expanded ? undefined : numberOfLines}
      >
        {text}
      </Text>
      {text.length > 80 && (
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => setExpanded(!expanded)}
          style={styles.toggleBtn}
        >
          <Text style={[styles.toggleText, { color: theme.colors.plum }]}>
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toggleBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
  }
});
