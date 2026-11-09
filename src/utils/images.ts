import {Directory, File, Paths} from 'expo-file-system';

const SCHEDULE_DIR_NAME = 'schedules';

/**
 * Copies a picked image from the temporary cache into the app's
 * permanent documents folder and returns the new, permanent URI
 */

export const persistScheduleImage = (tempUri: string): string => {
    const dir = new Directory(Paths.document, SCHEDULE_DIR_NAME);
    if(!dir.exists) dir.create();

    const lastSegment = tempUri.split('?')[0].split('/').pop() ?? '';
    const rawExt = lastSegment.includes('.') ? lastSegment.split('.').pop() : '';
    const ext = (rawExt ?? '').replace(/[^A-Za-z0-9]/g, '') || 'jpg';

    const target = new File(dir, `schedule-${Date.now()}.${ext}`);
    new File(tempUri).copy(target)
    return target.uri;
};

/**
* Deletes a saved Schedule image. Never throws, because a missing
* file should never block replacing an image or deleting a week. 
*/

export const deleteScheduleImage = (uri?: string | null): void => {
    if(!uri) return;
    try {
        const file = new File(uri);
        if(file.exists) file.delete();
    } catch (error) {
        console.error('Could not delete schedule image: ', error);
    }
}