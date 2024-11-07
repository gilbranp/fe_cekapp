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
  CBadge, 
  CModal, 
  CModalHeader, 
  CModalBody, 
  CModalFooter, 
  CFormInput, 
  CFormSelect 
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer & toast
import 'react-toastify/dist/ReactToastify.css'; // Import style for toast notifications
import { useNavigate } from 'react-router-dom';

const Barang = () => {
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBarang, setNewBarang] = useState({ nama: '', kategori_id: '', stok: 0, status: 'Tersedia' });
  const [updateStokVisible, setUpdateStokVisible] = useState(false);
  const [updateStokBarang, setUpdateStokBarang] = useState(null);
  const [jumlahUpdateStok, setJumlahUpdateStok] = useState(0);
  const [operation, setOperation] = useState('add');
  const [error, setError] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // State untuk search
  const itemsPerPage = 5; // jumlah barang yang ditampilkan per halaman
  const navigate = useNavigate();

  // Ambil data barang dari API
  const fetchData = () => {
    fetch('http://localhost:8000/api/barang')
      .then((response) => response.json())
      .then((data) => setBarang(data));

    fetch('http://localhost:8000/api/kategori')
      .then((response) => response.json())
      .then((data) => setKategori(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk menangani pencarian
  const filteredBarang = barang.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) // Filter berdasarkan nama
  );

  const handleTambahBarang = () => {
    setModalVisible(true);
  };

  const handleSaveBarang = () => {
    if (!newBarang.nama || !newBarang.kategori_id || !newBarang.stok || !newBarang.status) {
      setError('Semua field harus diisi!');
      return;
    }
    setError('');
    fetch('http://localhost:8000/api/barang', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBarang),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Gagal menambahkan barang');
        return response.json();
      })
      .then((data) => {
        setBarang((prev) => [...prev, data]);
        setModalVisible(false);
        setNewBarang({ nama: '', kategori_id: '', stok: 0, status: 'Tersedia' });
        toast.success('Barang berhasil ditambahkan!'); // Menggunakan toast untuk notifikasi berhasil
      })
      .catch((error) => {
        toast.error('Terjadi kesalahan saat menambahkan barang.'); // Menggunakan toast untuk notifikasi error
        console.error('Error:', error);
      });
  };

  const handleUpdateStok = (barang) => {
    setUpdateStokBarang(barang);
    setJumlahUpdateStok(0);
    setNamaBarang(barang.nama);
    setUpdateStokVisible(true);
  };

  const handleSaveUpdateStok = () => {
    if (jumlahUpdateStok !== 0) {
      const updatedStok = operation === 'add' 
        ? updateStokBarang.stok + Number(jumlahUpdateStok) 
        : updateStokBarang.stok - Number(jumlahUpdateStok); 

      if (updatedStok < 0) {
        toast.error('Stok tidak bisa kurang dari nol!');
        return;
      }

      const updatedBarang = { ...updateStokBarang, stok: updatedStok };

      fetch(`http://localhost:8000/api/barang/${updateStokBarang.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBarang),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Gagal mengupdate stok');
          return response.json();
        })
        .then((data) => {
          setBarang((prev) => prev.map((item) => (item.id === data.id ? data : item)));
          setUpdateStokVisible(false);
          toast.success('Stok berhasil diupdate!');
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus barang ini?');
    if (confirmDelete) {
      fetch(`http://localhost:8000/api/barang/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setBarang((prev) => prev.filter((item) => item.id !== id));
          toast.success('Barang berhasil dihapus!');
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  const goToKategori = () => {
    navigate('/kategori');
  };

  // Menghitung index untuk data yang ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBarang.slice(indexOfFirstItem, indexOfLastItem); // Filtered items
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage); // Total pages from filtered items

  return (
    <div className="container mt-4">
      <header className="row align-items-center pb-4 mb-4">
        <div className="col-12 col-md-6">
          <h2 className="text-primary mb-3 mb-md-0">Pengelolaan Barang</h2>
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
          <CButton color="primary" onClick={handleTambahBarang}>
            Tambah Barang
          </CButton>
          <CButton color="secondary" onClick={goToKategori}>
            Kategori
          </CButton>
        </div>
      </header>

      {/* Input Pencarian */}
      <CFormInput
        placeholder="Cari barang..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <div className="table-responsive">
        <CTable hover striped responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Nama Barang</CTableHeaderCell>
              <CTableHeaderCell>Kategori</CTableHeaderCell>
              <CTableHeaderCell>Stok</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Aksi</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="6" className="text-center">
                  Data barang belum ada, silahkan tambahkan barang yang tersedia.
                </CTableDataCell>
              </CTableRow>
            ) : (
              currentItems.map((item) => {
                let statusBarang;
                if (item.stok === 0) {
                  statusBarang = 'Kosong';
                } else if (item.stok < 3) {
                  statusBarang = 'Menipis';
                } else {
                  statusBarang = 'Tersedia';
                }

                return (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.id}</CTableDataCell>
                    <CTableDataCell>{item.nama}</CTableDataCell>
                    <CTableDataCell>{item.kategori ? item.kategori.nama_kategori : 'silahkan refresh halaman ini'}</CTableDataCell>
                    <CTableDataCell>{item.stok}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={statusBarang === 'Kosong' ? 'danger' : statusBarang === 'Menipis' ? 'warning' : 'success'}>
                        {statusBarang}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="warning" className="me-2" onClick={() => handleUpdateStok(item)}>
                        Stok
                      </CButton>
                      <CButton color="danger" onClick={() => handleDelete(item.id)}>
                        Hapus
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                );
              })
            )}
          </CTableBody>
        </CTable>
      </div>

      {/* Pagination */}
      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, pageIndex) => (
            <li className={`page-item ${pageIndex + 1 === currentPage ? 'active' : ''}`} key={pageIndex}>
              <button className="page-link" onClick={() => setCurrentPage(pageIndex + 1)}>
                {pageIndex + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal tambah barang */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>Tambah Barang</CModalHeader>
        <CModalBody>
          <CFormInput
            label="Nama Barang"
            value={newBarang.nama}
            onChange={(e) => setNewBarang((prev) => ({ ...prev, nama: e.target.value }))}
            className="mb-3"
          />
          <CFormSelect
            label="Kategori Barang"
            value={newBarang.kategori_id}
            onChange={(e) => setNewBarang((prev) => ({ ...prev, kategori_id: e.target.value }))}
            className="mb-3"
          >
            <option value="">Pilih Kategori</option>
            {kategori.map((kat) => (
              <option key={kat.id} value={kat.id}>
                {kat.nama_kategori}
              </option>
            ))}
          </CFormSelect>
          <CFormInput
            label="Stok Barang"
            type="number"
            value={newBarang.stok}
            onChange={(e) => setNewBarang((prev) => ({ ...prev, stok: Number(e.target.value) }))}
            className="mb-3"
          />
          <CFormSelect
            label="Status Barang"
            value={newBarang.status}
            onChange={(e) => setNewBarang((prev) => ({ ...prev, status: e.target.value }))}
            className="mb-3"
          >
            <option value="Tersedia">Tersedia</option>
            <option value="Kosong">Kosong</option>
          </CFormSelect>
          {error && <div className="text-danger">{error}</div>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleSaveBarang}>
            Simpan
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal update stok */}
      <CModal visible={updateStokVisible} onClose={() => setUpdateStokVisible(false)}>
        <CModalHeader closeButton>Update Stok</CModalHeader>
        <CModalBody>
          <p>Update stok untuk: {namaBarang}</p>
          <CFormSelect
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="mb-3"
          >
            <option value="add">Tambah Stok</option>
            <option value="subtract">Kurangi Stok</option>
          </CFormSelect>
          <CFormInput
            label="Jumlah Stok"
            type="number"
            value={jumlahUpdateStok}
            onChange={(e) => setJumlahUpdateStok(Number(e.target.value))}
            className="mb-3"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateStokVisible(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleSaveUpdateStok}>
            Simpan
          </CButton>
        </CModalFooter>
      </CModal>

      <ToastContainer /> {/* Render ToastContainer */}
    </div>
  );
};

export default Barang;
