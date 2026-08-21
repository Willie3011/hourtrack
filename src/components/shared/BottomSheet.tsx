import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import {
    colors,
    fontSize,
    fontWeight,
    borderRadius,
    spacing,
    shadow
} from "../../utils/theme";

interface BottomSheetProps {
    visible: boolean;
    onDismiss: () => void;
    title: string;
    children: React.ReactNode
}

export default function BottomSheet({
    visible,
    onDismiss,
    title,
    children
}: BottomSheetProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType='slide'
            onRequestClose={onDismiss}
        >
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onDismiss}
                />
                <View style={styles.sheet}>
                    <View style={styles.handle} />
                    <Text style={styles.title}>{title}</Text>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    sheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
        paddingBottom: spacing.xxxxxl,
        maxHeight: '85%',
        ...shadow.lg
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: borderRadius.full,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginBottom: spacing.lg
    },
    title: {
        fontSize: fontSize.h2,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.lg
    }
})