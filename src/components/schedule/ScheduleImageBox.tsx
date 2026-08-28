import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '@/src/utils/theme';
import { Ionicons } from '@expo/vector-icons';

interface ScheduleImageBoxProps {
    imageUri: string;
    onImageSelected: (uri: string) => void;
}

export default function ScheduleImageBox({
    imageUri,
    onImageSelected
}: ScheduleImageBoxProps) {
    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if( !permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if(!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    if(imageUri) {
        return (
            <View style={styles.container}>
                <Image
                    source={{uri: imageUri}}
                    style={styles.image}
                    resizeMode='cover'
                />
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {}}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="expand" size={16} color={colors.textSecondary} />
                        <Text style={styles.actionLabel}>View fullscreen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={pickImage}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="refresh" size={16} color={colors.textSecondary}/>
                        <Text style={styles.actionLabel}>Replace image</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
  return (
    <TouchableOpacity
        style={styles.emptyBox}
        onPress={pickImage}
        activeOpacity={0.7}
    >
        <Ionicons name="image-outline" size={32} color={colors.textHint} />
        <Text style={styles.emptyLabel}>No schedule image uploaded</Text>
        <Text style={styles.uploadLabel}>+ Upload schedule image</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md
    },
    image: {
        width: '100%',
        height: 160,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.sm
    },
    actionRow: {
        flexDirection: 'row',
        gap: spacing.md
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.sm,
        justifyContent: 'center',
        backgroundColor: colors.surface
    },
    actionLabel: {
        fontSize: fontSize.caption,
        color: colors.textSecondary
    },
    emptyBox: {
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: borderRadius.sm,
        padding: spacing.xxl,
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
        backgroundColor: colors.surface
    },
    emptyLabel: {
        fontSize: fontSize.caption,
        color: colors.textMuted
    },
    uploadLabel: {
        fontSize: fontSize.caption,
        color: colors.emerald,
        fontWeight: fontWeight.semibold
    }
})