import * as React from 'react'
import { View, StyleSheet } from 'react-native'

interface CentralizerProps {
  children: React.ReactNode
}

export const Centralizer: React.FC<CentralizerProps> = ({ children }) => {
  return <View style={styles.centralizerRoot}>{children}</View>
}

const styles = StyleSheet.create({
  centralizerRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
