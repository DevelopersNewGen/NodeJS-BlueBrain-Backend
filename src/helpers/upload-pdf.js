import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import fs from "fs";

export async function uploadPdfToOneDrive(localFilePath, oneDriveFileName, accessToken) {
    if (!fs.existsSync(localFilePath)) {
        throw new Error(`Archivo local no encontrado: ${localFilePath}`);
    }

    const client = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });

    const fileStream = fs.createReadStream(localFilePath);
    const safeFileName = oneDriveFileName.replace(/[\/\\#%&{}<>*? $!'":@+`|=()]/g, "_");

    try {
        const uploadResponse = await client
            .api(`/me/drive/root:/${safeFileName}:/content`)
            .put(fileStream);

        const shareResponse = await client
            .api(`/me/drive/items/${uploadResponse.id}/createLink`)
            .post({
                type: "view", 
                scope: "organization" 
            });

        return {
            ...uploadResponse,
            publicUrl: shareResponse.link.webUrl
        };
    } catch (error) {
        console.error("Error al subir archivo a OneDrive:", error.message);
        throw error;
    }
}