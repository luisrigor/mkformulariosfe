export type ResponseFileBlob = {
  file: Blob
  fileName: string
}

export class FileUtils {
  /* istanbul ignore next */

  static open = ({ file, fileName }: ResponseFileBlob): void => {
    let fileUrl = ''
    if (file) {
      fileUrl = window.URL.createObjectURL(file)
    }
    else {
      window.open(window.location.pathname, '_blank')
      return
    }

    const tempLink = document.createElement('a')
    tempLink.href = fileUrl
    tempLink.download = fileName

    tempLink.click()

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(fileUrl)
    }, 100)
  }
  static convertBase64ToArrayBuffer (base64: string): Uint8Array {
    const binary = atob(base64.replace(/\s/g, ''))
    const len = binary.length
    const buffer = new ArrayBuffer(len)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i)
    }

    return view

  }

}