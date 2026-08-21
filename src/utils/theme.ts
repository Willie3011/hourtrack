export const colors = {
    // Brand colors
    emerald: '#10b981',
    emeraldDark: '#059669',
    emeraldLight: '#d1fae5',
    emeraldSoft: '#6ee7b7',
    forest: '#166534',
    forestLight: '#dcfce7',
    forestDark: '#064e3b',
    forestDeeper: '#022c22',

    // Neutral colors - light mode
    textPrimary: '#111111',
    textSecondary: '#555555',
    textMuted: '#999999',
    textHint: '#aaaaaa',
    background: '#ffffff',
    surface: '#fafafa',
    border: '#e0e0e0',

    // Neutral color - dark mode
    textPrimaryDark: '#ffffff',
    textSecondaryDark: '#aaaaaa',
    textMutedDark: '#666666',
    backgroundDark: '#111111',
    surfaceDark: '#1a1a1a',
    borderDark: '#333333',


    // Semantic colors
    error: '#e05252',
    errorLight: '#fee2e2',
    success: '#4caf7d',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    info: '#e0e7ff',

    // Shift type badge colors
    regularBadgeBg: '#d1fae5',
    regularBadgeText: '#166534',
    holidayBadgeBg: '#dcfce7',
    holidayBadgeText: '#14532d',
    nightshiftBadgeBg: '#e0e7ff',
    nightshiftBadgeText: '#3730a3',
    overtimeBadgeBg: '#fef3cf',
    overtimeBadgeText: '#92400e',
}

export const fontSize = {
    display: 28,
    h1: 22,
    h2: 18,
    h3: 15,
    body: 13,
    label: 11,
    caption: 10,
    hint: 10,
    button: 13,
    earnings: 24
};

export const fontWeight = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
}

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40,
    xxxxxl: 48
}

export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    full: 9999,
}

export const shadow = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8
    },
    
}