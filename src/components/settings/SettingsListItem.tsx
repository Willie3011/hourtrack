import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type Variant = 'green' | 'forest' | 'indigo';

const VARIANTS: Record<Variant, {bg: string; fg: string}> = {
    green: {bg: colors.emeraldLight, fg: colors.forest},
    forest: {bg: colors.forest, fg: colors.background},
    indigo: {bg: colors.nightshiftBadgeBg, fg: colors.nightshiftBadgeText}
}

interface SettingsListItemProps {
    icon: IconName;
    variant?: Variant;
    title: string;
    subtitle?: string;
    value?: string;
    onPress: () => void;
    toggle?: {
        value: boolean;
        onChange: (value: boolean) => void;
    }; 
}

export default function SettingsListItem({
    icon,
    variant = 'green',
    title,
    subtitle,
    value,
    onPress,
    toggle,
}: SettingsListItemProps) {
    const colorSet = VARIANTS[variant];

    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconWrap, {backgroundColor: colorSet.bg}]}>
                <Ionicons name={icon} size={16} color={colorSet.fg} />
            </View>

            <View style={styles.main}>
                <Text style={styles.title} >{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            {toggle ? (
                <TouchableOpacity
                    style={[styles.track, toggle.value && styles.trackOn]}
                    onPress={() => toggle.onChange(!toggle.value)}
                    activeOpacity={0.8}
                    hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                >
                    <View style={[styles.thumb, toggle.value && styles.thumbOn]}/>
                </TouchableOpacity>
            ) : (
                <>
                    {value ? <Text style={styles.value}>{value}</Text> : null}
                    <Ionicons name="chevron-forward" size={16} color={colors.textHint}/>
                </>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        minHeight: 56
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center'
    },
    main: {flex: 1},
    title: {
        fontSize: fontSize.caption,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        marginTop: 2
    },
    value: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.emeraldDark
    },
    track: {
        width: 42,
        height: 24,
        borderRadius: borderRadius.full,
        backgroundColor: colors.border,
        justifyContent: 'center',
        padding: 2,
    },
    trackOn: {
        backgroundColor: colors.emerald
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background,
        alignSelf: 'flex-start'
    },
    thumbOn: {
        alignSelf: 'flex-end'
    }
})