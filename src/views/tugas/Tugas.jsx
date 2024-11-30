/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CAlert,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const Tugas = () => {
  const [tugas, setTugas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState(null);
  const [newTugas, setNewTugas] = useState({
    judul: '',
    deskripsi: '',
    batas_waktu: '',
    status: 'Belum Mulai',
    prioritas: 'Sedang',
    diberikan_kepada: '',
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

// Ambil data tugas
const fetchData = () => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage (atau sumber lain)
  
  if (!token) {
    console.error('Token tidak ditemukan. Pastikan pengguna sudah login.');
    return;
  }

  fetch('http://localhost:8000/api/tugas', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Tambahkan token autentikasi
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Data dari API:', data);
      setTugas(data); // Update state dengan data dari API
    })
    .catch((error) => console.error('Error:', error));
};


  // Ambil daftar pengguna
  const fetchUsers = () => {
    fetch('http://localhost:8000/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

 // Tambah tugas baru
const handleSaveTugas = () => {
  if (!newTugas.judul || !newTugas.diberikan_kepada) {
    setError('Judul dan Diberikan Kepada harus diisi!');
    return;
  }

  setError('');
  
  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  
  if (!token) {
    setError('Token tidak ditemukan. Pastikan pengguna sudah login.');
    return;
  }

  fetch('http://localhost:8000/api/tugas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Tambahkan token autentikasi
    },
    body: JSON.stringify(newTugas),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Gagal menambahkan tugas');
      return response.json();
    })
    .then((data) => {
      setTugas((prev) => [...prev, data.tugas]);
      setModalVisible(false);
      setNewTugas({
        judul: '',
        deskripsi: '',
        batas_waktu: '',
        status: 'Belum Mulai',
        prioritas: 'Sedang',
        diberikan_kepada: '',
      });
      setSuccessMessage('Tugas berhasil ditambahkan!');
    })
    .catch((error) => {
      setError('Terjadi kesalahan saat menambahkan tugas.');
      console.error('Error:', error);
    });
};

  // Tampilkan detail tugas
  const handleShowDetail = (tugas) => {
    setSelectedTugas(tugas);
    setDetailModalVisible(true);
  };

  // Hapus tugas
  const handleDeleteTugas = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      fetch(`http://localhost:8000/api/tugas/${id}`, { method: 'DELETE' })
        .then((response) => {
          if (!response.ok) throw new Error('Gagal menghapus tugas');
          setTugas((prev) => prev.filter((item) => item.id !== id));
          setSuccessMessage('Tugas berhasil dihapus!');
        })
        .catch((error) => {
          setError('Terjadi kesalahan saat menghapus tugas.');
          console.error('Error:', error);
        });
    }
  };

  const goToDetailTugas = (id) => {
    navigate(`/detailtugas/${id}`);
  };

  return (
    <div className="container mx-auto mt-4 px-4">
      <header className="flex justify-between items-center pb-4 mb-4 border-b">
        <h2 className="text-primary">Pengelolaan Tugas</h2>
        <CButton color="primary" onClick={() => setModalVisible(true)}>
          Tambah Tugas
        </CButton>
      </header>

      {successMessage && (
        <CAlert color="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </CAlert>
      )}

      {error && <p className="text-danger">{error}</p>}

      <CTable hover striped responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Judul</CTableHeaderCell>
            <CTableHeaderCell>Deskripsi</CTableHeaderCell>
            <CTableHeaderCell>Batas Waktu</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Prioritas</CTableHeaderCell>
            <CTableHeaderCell>Diberikan Kepada</CTableHeaderCell>
            <CTableHeaderCell>Aksi</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {tugas.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                Data tugas belum ada.
              </CTableDataCell>
            </CTableRow>
          ) : (
            tugas.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.judul}</CTableDataCell>
                <CTableDataCell>{item.deskripsi || '-'}</CTableDataCell>
                <CTableDataCell>{item.batas_waktu || '-'}</CTableDataCell>
                <CTableDataCell>{item.status}</CTableDataCell>
                <CTableDataCell>{item.prioritas}</CTableDataCell>
                <CTableDataCell>
                  {users.find((user) => user.id === item.diberikan_kepada)?.nama || '-'}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" size="sm" onClick={() => handleShowDetail(item)}>
                    Detail
                  </CButton>{' '}
                  <CButton color="danger" size="sm" onClick={() => handleDeleteTugas(item.id)}>
                    Hapus
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>

      {/* Modal Tambah Tugas */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <h5 className="modal-title">Tambah Tugas</h5>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            placeholder="Judul Tugas"
            value={newTugas.judul}
            onChange={(e) => setNewTugas({ ...newTugas, judul: e.target.value })}
            className="mb-3"
          />
          <CFormInput
            type="text"
            placeholder="Deskripsi"
            value={newTugas.deskripsi}
            onChange={(e) => setNewTugas({ ...newTugas, deskripsi: e.target.value })}
            className="mb-3"
          />
          <CFormInput
            type="date"
            placeholder="Batas Waktu"
            value={newTugas.batas_waktu}
            onChange={(e) => setNewTugas({ ...newTugas, batas_waktu: e.target.value })}
            className="mb-3"
          />
          <CFormSelect
            value={newTugas.status}
            onChange={(e) => setNewTugas({ ...newTugas, status: e.target.value })}
            className="mb-3"
          >
            <option value="Belum Mulai">Belum Mulai</option>
            <option value="Dalam Proses">Dalam Proses</option>
            <option value="Selesai">Selesai</option>
          </CFormSelect>
          <CFormSelect
            value={newTugas.prioritas}
            onChange={(e) => setNewTugas({ ...newTugas, prioritas: e.target.value })}
            className="mb-3"
          >
            <option value="Rendah">Rendah</option>
            <option value="Sedang">Sedang</option>
            <option value="Tinggi">Tinggi</option>
          </CFormSelect>
          <CFormSelect
            value={newTugas.diberikan_kepada}
            onChange={(e) => setNewTugas({ ...newTugas, diberikan_kepada: e.target.value })}
            className="mb-3"
          >
            <option value="">Pilih Pengguna</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nama}
              </option>
            ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Tutup
          </CButton>
          <CButton color="primary" onClick={handleSaveTugas}>
            Simpan
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Detail Tugas */}
      <CModal visible={detailModalVisible} onClose={() => setDetailModalVisible(false)}>
        <CModalHeader closeButton>
          <h5 className="modal-title">Detail Tugas</h5>
        </CModalHeader>
        <CModalBody>
          {selectedTugas ? (
            <>
              <p>
                <strong>Judul:</strong> {selectedTugas.judul}
              </p>
              <p>
                <strong>Deskripsi:</strong> {selectedTugas.deskripsi}
              </p>
              <p>
                <strong>Batas Waktu:</strong> {selectedTugas.batas_waktu}
              </p>
              <p>
                <strong>Status:</strong> {selectedTugas.status}
              </p>
              <p>
                <strong>Prioritas:</strong> {selectedTugas.prioritas}
              </p>
              <p>
                <strong>Diberikan Kepada:</strong>{' '}
                {users.find((user) => user.id === selectedTugas.diberikan_kepada)?.nama || '-'}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDetailModalVisible(false)}>
            Tutup
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Tugas;
