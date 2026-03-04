import { useWindowDimensions } from 'react-native'

/**
 * Returns true when the short side of the screen is >= 768pt,
 * which is the iPad mini breakpoint. Works on both iOS and Android tablets.
 * All layout decisions that use this hook are therefore safe for phones.
 */
export function useIsTablet(): boolean {
    const { width, height } = useWindowDimensions()
    const shortSide = Math.min(width, height)
    return shortSide >= 768
}
