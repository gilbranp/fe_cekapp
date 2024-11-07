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
  CFormInput 
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Kategori = () => {
  const [kategori, setKategori] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [newKategori, setNewKategori] = useState({ nama_kategori: '' });
  const [editKategori, setEditKategori] = useState({ id: '', nama_kategori: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // jumlah kategori yang ditampilkan per halaman
  const navigate = useNavigate();

  // Ambil data kategori dari API
  const fetchData = () => {
    fetch('http://localhost:8000/api/kategori')
      .then((response) => response.json())
      .then((data) => setKategori(data))
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTambahKategori = () => {
    setModalVisible(true);
  };

  const handleSaveKategori = () => {
    if (!newKategori.nama_kategori) {
      toast.error('Nama kategori harus diisi!');
      return;
    }
    fetch('http://localhost:8000/api/kategori', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newKategori),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Gagal menambahkan kategori');
        return response.json();
      })
      .then((data) => {
        setKategori((prev) => [...prev, data]);
        setModalVisible(false);
        setNewKategori({ nama_kategori: '' });
        toast.success('Kategori berhasil ditambahkan!');
      })
      .catch((error) => {
        toast.error('Terjadi kesalahan saat menambahkan kategori.');
        console.error('Error:', error);
      });
  };

  const handleEdit = (item) => {
    setEditKategori(item);
    setModalEditVisible(true);
  };

  const handleUpdateKategori = () => {
    if (!editKategori.nama_kategori) {
      toast.error('Nama kategori harus diisi!');
      return;
    }
    fetch(`http://localhost:8000/api/kategori/${editKategori.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editKategori),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Gagal memperbarui kategori');
        return response.json();
      })
      .then((data) => {
        setKategori((prev) =>
          prev.map((item) => (item.id === data.id ? data : item))
        );
        setModalEditVisible(false);
        setEditKategori({ id: '', nama_kategori: '' });
        toast.success('Kategori berhasil diperbarui!');
      })
      .catch((error) => {
        toast.error('Terjadi kesalahan saat memperbarui kategori.');
        console.error('Error:', error);
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus kategori ini?');
    if (confirmDelete) {
      fetch(`http://localhost:8000/api/kategori/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setKategori((prev) => prev.filter((item) => item.id !== id));
          toast.success('Kategori berhasil dihapus!');
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  const goToBarang = () => {
    navigate('/barang');
  };

  const filteredKategori = kategori.filter((item) => 
    item.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKategori.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKategori.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <header className="row align-items-center pb-4 mb-4">
        <div className="col-12 col-md-6">
          <h2 className="text-primary mb-3 mb-md-0">Pengelolaan Kategori</h2>
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
          <CButton color="primary" onClick={handleTambahKategori}>
            Tambah Kategori
          </CButton>
          <CButton color="secondary" onClick={goToBarang}>
            Barang
          </CButton>
        </div>
      </header>

      <ToastContainer />

      <div className="mb-3">
        <CFormInput
          type="text"
          placeholder="Cari kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <CTable hover striped responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Nama Kategori</CTableHeaderCell>
              <CTableHeaderCell>Aksi</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="3" className="text-center">
                  Data kategori belum ada, silahkan tambahkan kategori yang tersedia.
                </CTableDataCell>
              </CTableRow>
            ) : (
              currentItems.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.id}</CTableDataCell>
                  <CTableDataCell>{item.nama_kategori}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" onClick={() => handleEdit(item)} className="me-2">
                      Edit
                    </CButton>
                    <CButton color="danger" onClick={() => handleDelete(item.id)}>
                      Hapus
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>

      <nav>
        <ul className="pagination justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <h5>Tambah Kategori</h5>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Nama Kategori"
            value={newKategori.nama_kategori}
            onChange={(e) => setNewKategori({ ...newKategori, nama_kategori: e.target.value })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Tutup
          </CButton>
          <CButton color="primary" onClick={handleSaveKategori}>
            Simpan
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={modalEditVisible} onClose={() => setModalEditVisible(false)}>
        <CModalHeader closeButton>
          <h5>Edit Kategori</h5>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Nama Kategori"
            value={editKategori.nama_kategori}
            onChange={(e) => setEditKategori({ ...editKategori, nama_kategori: e.target.value })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalEditVisible(false)}>
            Tutup
          </CButton>
          <CButton color="primary" onClick={handleUpdateKategori}>
            Simpan Perubahan
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Kategori;
