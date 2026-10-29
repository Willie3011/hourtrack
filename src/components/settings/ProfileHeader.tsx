import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
    name: string;
    onPress: () => void;
}

export default function ProfileHeader({name, onPress}: ProfileHeaderProps) {
    const initial = name.trim().charAt(0).toUpperCase();

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.avatar}>
                {initial ? (
                    <Text style={styles.initial}>{initial}</Text>
                ) : (
                    <Ionicons name="person" size={20} color={colors.background}/>
                )}
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{name || 'Add your name'}</Text>
                <Text style={styles.sub}>Shown on your hoe screen and reports</Text>
            </View>
            <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.sm
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: colors.forest,
        alignItems: 'center',
        justifyContent: 'center'
    },
    initial: {
        fontSize: fontSize.h2,
        fontWeight: fontWeight.bold,
        color: colors.background
    },
    info: {flex: 1},
    name: {
        fontSize: fontSize.h3,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary
    },
    sub: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        marginTop: 2
    },
    edit: {
        fontSize: fontSize.caption,
        fontWeight: fontWeight.bold,
        color: colors.emerald
    }
})