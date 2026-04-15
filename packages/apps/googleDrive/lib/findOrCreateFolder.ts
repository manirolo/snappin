import { FindOrCreateFolderProps, FindOrCreateFolderResponse } from "../../appRegistry.interface"
import { getGoogleDriveClient } from "../googleDrive.client"

const FOLDER_MIME = "application/vnd.google-apps.folder"

export async function findOrCreateFolder({ accessToken, folderName }: FindOrCreateFolderProps): Promise<FindOrCreateFolderResponse> {

    const drive = getGoogleDriveClient(accessToken)

    const { data } = await drive.files.list({
        q: `mimeType='${FOLDER_MIME}' and name='${folderName}' and trashed=false`,
        fields: "files(id, name)",
        pageSize: 1
    })

    if (data.files?.length) {
        const folderId = data.files[0]?.id
        if (!folderId) throw new Error(`Found folder '${folderName}' but id was missing`)
        return { folderId }
    }

    const { data: folder } = await drive.files.create({
        requestBody: {
            name: folderName,
            mimeType: FOLDER_MIME,
        },
        fields: "id"
    })

    if (!folder.id) {
        throw new Error(`Failed to create folder '${folderName}' in Google Drive`)
    }

    return { folderId: folder.id }
}