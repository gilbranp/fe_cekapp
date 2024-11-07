/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const Keuangan = () => {
  const [laporanKeuangan, setLaporanKeuangan] = useState([]);
  const [newEntry, setNewEntry] = useState({ tanggal: '', keterangan: '', pemasukan: 0, pengeluaran: 0 });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman saat ini
  const itemsPerPage = 5; // Menampilkan 5 data per halaman

  useEffect(() => {
    fetchLaporanKeuangan();
  }, []);

  const fetchLaporanKeuangan = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/keuangan');
      setLaporanKeuangan(response.data);
    } catch (error) {
      console.error('Error fetching laporan keuangan:', error);
    }
  };

  const handleAddOrEditEntry = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    if (isEditing) {
      try {
        await axios.put(`http://localhost:8000/api/keuangan/${laporanKeuangan[editingIndex].id}`, newEntry);
        toast.success('Data berhasil diperbarui!');
        fetchLaporanKeuangan();
      } catch (error) {
        console.error('Error updating entry:', error);
        toast.error('Gagal memperbarui data!');
      }
    } else {
      try {
        await axios.post('http://localhost:8000/api/keuangan', newEntry);
        toast.success('Data berhasil ditambahkan!');
        fetchLaporanKeuangan();
      } catch (error) {
        console.error('Error adding entry:', error);
        toast.error('Gagal menambahkan data!');
      }
    }
    resetForm();
    setIsProcessing(false);
  };

  const handleEditEntry = (index) => {
    setNewEntry(laporanKeuangan[index]);
    setEditingIndex(index);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDeleteEntry = async (index) => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    const entryId = laporanKeuangan[index].id;
    setIsProcessing(true);
    try {
      await axios.delete(`http://localhost:8000/api/keuangan/${entryId}`);
      toast.success('Data berhasil dihapus!');
      fetchLaporanKeuangan();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Gagal menghapus data!');
    }
    setIsProcessing(false);
  };

  const resetForm = () => {
    setNewEntry({ tanggal: '', keterangan: '', pemasukan: 0, pengeluaran: 0 });
    setIsEditing(false);
    setEditingIndex(null);
    setModalVisible(false);
  };

  const totalPemasukan = laporanKeuangan.reduce((acc, item) => acc + item.pemasukan, 0);
  const totalPengeluaran = laporanKeuangan.reduce((acc, item) => acc + item.pengeluaran, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  // Fungsi untuk ekspor ke Excel
  const exportToExcel = () => {
    const dataForExport = laporanKeuangan.map(item => ({
      ID: item.id,
      Tanggal: item.tanggal,
      Keterangan: item.keterangan,
      Pemasukan: item.pemasukan,
      Pengeluaran: item.pengeluaran,
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan");

    XLSX.writeFile(wb, "laporan_keuangan.xlsx");
  };

  // Pagination functions
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = laporanKeuangan.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(laporanKeuangan.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Laporan Keuangan Keluarga</h2>
      <button className="btn btn-primary mb-4" onClick={() => setModalVisible(true)}>
        Tambah Data
      </button>

      <button className="btn btn-success mb-4 ms-2" onClick={exportToExcel}>
        Ekspor ke Excel
      </button>

      <div className={`modal ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isEditing ? 'Edit Data' : 'Tambah Data'}</h5>
              <button type="button" className="btn-close" onClick={resetForm}></button>
            </div>
            <form onSubmit={handleAddOrEditEntry}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="tanggal" className="form-label">Tanggal</label>
                  <input
                    type="date"
                    id="tanggal"
                    className="form-control"
                    value={newEntry.tanggal}
                    onChange={(e) => setNewEntry({ ...newEntry, tanggal: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="keterangan" className="form-label">Keterangan</label>
                  <input
                    type="text"
                    id="keterangan"
                    className="form-control"
                    placeholder="Keterangan"
                    value={newEntry.keterangan}
                    onChange={(e) => setNewEntry({ ...newEntry, keterangan: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="pemasukan" className="form-label">Pemasukan</label>
                  <input
                    type="number"
                    id="pemasukan"
                    className="form-control"
                    placeholder="Pemasukan"
                    value={newEntry.pemasukan}
                    onChange={(e) => setNewEntry({ ...newEntry, pemasukan: Number(e.target.value) })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="pengeluaran" className="form-label">Pengeluaran</label>
                  <input
                    type="number"
                    id="pengeluaran"
                    className="form-control"
                    placeholder="Pengeluaran"
                    value={newEntry.pengeluaran}
                    onChange={(e) => setNewEntry({ ...newEntry, pengeluaran: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Tutup</button>
                <button type="submit" className="btn btn-primary">
                  {isProcessing ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : (isEditing ? 'Update' : 'Tambah')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Pemasukan</th>
              <th>Pengeluaran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.tanggal}</td>
                <td>{item.keterangan}</td>
                <td>{item.pemasukan}</td>
                <td>{item.pengeluaran}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditEntry(index)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEntry(index)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-outline-primary" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Halaman {currentPage}</span>
        <button className="btn btn-outline-primary" onClick={handleNextPage} disabled={currentPage === Math.ceil(laporanKeuangan.length / itemsPerPage)}>Next</button>
      </div>

      <div className="mt-3">
        <h4>Total Pemasukan: Rp{totalPemasukan}</h4>
        <h4>Total Pengeluaran: Rp{totalPengeluaran}</h4>
        <h4>Saldo: Rp{saldo}</h4>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Keuangan;
