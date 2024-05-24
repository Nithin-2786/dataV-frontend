import React, { useEffect, useState } from 'react'

export default function Upload({ accessToken, processData }) {
  const [files, setFiles] = useState([])
  const [selectedFileData, setSelectedFileData] = useState(null)
  const [popupMessage, setPopupMessage] = useState('')

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('https://datav-backend-1.onrender.com/api/getfiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('data:', data)
        setFiles(data.files) // Assuming the server returns a JSON object with a "files" array
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchFiles()
  }, [accessToken])

  const handleFileClick = async (fileId, filename) => {
    try {
      const response = await fetch(`https://datav-backend-1.onrender.com/api/file/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: accessToken,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()
      const jsonData = JSON.parse(text)
      processData(jsonData)
      setSelectedFileData(jsonData) // Update state with selected file data

      // Set popup message
      setPopupMessage(`Loading data from: ${filename}`)

      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // Hide popup after 3 seconds
      setTimeout(() => {
        setPopupMessage('')
      }, 5000)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleFileDownload = async (fileId, filename) => {
    try {
      const response = await fetch(`https://datav-backend-1.onrender.com/api/file/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: accessToken,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename) // Set the desired file name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)


      // Set popup message
      setPopupMessage(`Download initiated for: ${filename}`)

      

      // Hide popup after 3 seconds
      setTimeout(() => {
        setPopupMessage('')
      }, 5000)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      {popupMessage && <div style={styles.popup}>{popupMessage}</div>}
      <header style={styles.header}>Uploaded Files</header>
      <div style={styles.container}>
        {sessionStorage.getItem("accessToken") ? null :<p>You can view your files if you have an account</p>}
        {files.map((file, index) => (
          <div key={index} style={styles.fileItem}>
            <span style={styles.fileName}>{file.filename}</span>
            <div>
              <button
                onClick={() => handleFileClick(file.fileId, file.filename)}
                style={styles.button}
              >
                Use Data
              </button>
              <button
                onClick={() => handleFileDownload(file.fileId, file.filename)}
                style={styles.button}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      {/*{selectedFileData && (
        <div style={styles.selectedFileData}>
          
          <pre>{JSON.stringify(selectedFileData, null, 2)}</pre>
        </div>
      ) */}
    </div>
  )
}

const styles = {
  popup: {
    position: 'fixed',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgb(47, 255, 0)',
    color: '#000000',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    transition: 'opacity 0.3s ease',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'rgb(255,255,255)',
  },
  container: {
    backgroundColor: 'rgba(0, 10, 39, 0.685)',
    padding: '20px',
    borderRadius: '10px',
    color: 'rgba(255, 255, 255, 0.858)',
  },
  fileItem: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.858)',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  fileName: {
    fontWeight: 'bold',
    color: 'rgb(0, 10, 39)',
  },
  button: {
    background: 'rgb(0, 10, 39)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '8px 12px',
    marginLeft: '10px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  selectedFileData: {
    marginTop: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.858)',
    padding: '10px',
    borderRadius: '5px',
    color: 'rgb(0, 10, 39)',
  },
}
