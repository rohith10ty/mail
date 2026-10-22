function openFiles() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mail-attachments', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('files')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function storeAttachment(file) {
  const db = await openFiles()
  const key = crypto.randomUUID()
  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite')
      transaction.objectStore('files').put(file, key)
      transaction.oncomplete = resolve
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
    return { name: file.name, key, size: file.size }
  } finally { db.close() }
}

export async function downloadAttachment(email) {
  let blob
  let name = email.attachment
  if (email.attachmentKey) {
    const db = await openFiles()
    try {
      blob = await new Promise((resolve, reject) => {
        const request = db.transaction('files').objectStore('files').get(email.attachmentKey)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } finally { db.close() }
    if (!blob) throw new Error('This file is no longer available in this browser.')
  } else {
    // Seed messages carry mock metadata; offer explicitly named sample notes.
    name = `${email.attachment}.sample.txt`
    blob = new Blob([`MAIL DEMO — SAMPLE ATTACHMENT NOTES\n\nFile: ${email.attachment}\nFrom: ${email.sender}\nSubject: ${email.subject}\n\n${email.body}\n\nThis is a sample summary, not the original file.`], { type: 'text/plain;charset=utf-8' })
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
