import { borderRadius } from "@/src/utils/theme";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface ScheduleThumbnailProps {
    imageUri: string;
    onPress: () => void;
}

export default function ScheduleThumbnail({
    imageUri,
    onPress
}: ScheduleThumbnailProps) {
    return (
        <TouchableOpacity>
            <Image
                source={{ uri: imageUri }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    thumbnail: {
        width: '100%',
        height: 80,
        borderRadius: borderRadius.sm
    }
})