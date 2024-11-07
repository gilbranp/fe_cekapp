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
  const [detailModalVisible, setDetailModalVisible] = useState(false); // Modal untuk detail tugas
  const [selectedTugas, setSelectedTugas] = useState(null); // Untuk menyimpan tugas yang dipilih
  const [newTugas, setNewTugas] = useState({
    judul: '',
    deskripsi: '',
    batas_waktu: '',
    status: 'Belum Mulai',
    prioritas: 'Sedang',
    diberikan_kepada: '',
  });
  const [users, setUsers] = useState([]); // State untuk menyimpan daftar user
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Ambil data tugas dari API
  const fetchData = () => {
    fetch('http://localhost:8000/api/tugas')
      .then((response) => response.json())
      .then((data) => setTugas(data))
      .catch((error) => console.error('Error:', error));
  };

  // Ambil daftar user dari API
  const fetchUsers = () => {
    fetch('http://localhost:8000/api/users') // API untuk daftar user
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // Simpan data user ke state
        console.log(data); // Debugging: pastikan data user benar
      })
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    fetchData();
    fetchUsers(); // Panggil fetchUsers untuk mendapatkan daftar user
  }, []);

  // Fungsi untuk menambahkan tugas baru
  const handleSaveTugas = () => {
    if (!newTugas.judul || !newTugas.diberikan_kepada) {
      setError('Judul dan Diberikan Kepada harus diisi!');
      return;
    }

    setError('');
    fetch('http://localhost:8000/api/tugas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  // Fungsi untuk menampilkan detail tugas
  const handleShowDetail = (tugas) => {
    setSelectedTugas(tugas);
    setDetailModalVisible(true);
  };

  // Fungsi untuk menghapus tugas
  const handleDeleteTugas = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      fetch(`http://localhost:8000/api/tugas/${id}`, {
        method: 'DELETE',
      })
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
    navigate(`/detailtugas/${id}`); // Menyertakan id dalam URL
  };
  

  return (
    <div className="container mt-4">
      <header className="row align-items-center pb-4 mb-4">
        <div className="col-12 col-md-6">
          <h2 className="text-primary mb-3 mb-md-0">Pengelolaan Tugas</h2>
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
          <CButton color="primary" onClick={() => setModalVisible(true)}>
            Tambah Tugas
          </CButton>
        </div>
      </header>

      {successMessage && (
        <CAlert color="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </CAlert>
      )}

      {error && <p className="text-danger">{error}</p>}

      <div className="table-responsive">
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
            <CTableHeaderCell>Dibuat Oleh</CTableHeaderCell> {/* Kolom baru */}
            <CTableHeaderCell>Aksi</CTableHeaderCell>
        </CTableRow>
        </CTableHead>

        <CTableBody>
  {tugas.length === 0 ? (
    <CTableRow>
      <CTableDataCell colSpan="9" className="text-center"> {/* Ubah 8 menjadi 9 */}
        Data tugas belum ada, silahkan tambahkan tugas baru.
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
          {/* Mencari nama pengguna berdasarkan ID yang terdapat di `created_by` */}
          {users.find((user) => user.id === item.dibuat_oleh)?.nama || '-'}
        </CTableDataCell>
        <CTableDataCell>
        <CButton color="info" size="sm" onClick={() => goToDetailTugas(item.id)}>
          Lihat Detail
        </CButton>
        {' '}
          <CButton color="warning" size="sm">
            Pengajuan
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
      </div>

      {/* Modal untuk tambah tugas */}
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
              <option key={user.id} value={user.nama}>
                {user.nama}
              </option>
            ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleSaveTugas}>
            Simpan
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Tugas;
