import { settings } from '../../api/const';

function uploadAdapter(loader: any) {
    return {
        upload: () => {
            return new Promise((resolve, reject) => {
                const body = new FormData();

                loader.file.then((file: any) => {
                    body.append('attachment', file);
                    fetch(`${settings.FILE_URL}/upload/attachments/`, {
                        method: 'post',
                        body: body,
                    })
                        .then(res => res.json())
                        .then(res => {
                            resolve({
                                default: `${settings.FILE_URL}/${res[0].url}`,
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            });
        },
    };
}

export default function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return uploadAdapter(loader);
    };
}
