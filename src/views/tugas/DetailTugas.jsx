/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react';

const DetailTugas = () => {
  const { id } = useParams();
  const [tugas, setTugas] = useState(null);
  const [error, setError] = useState('');
  const [diberikanKepada, setDiberikanKepada] = useState('');
  const [dibuatOleh, setDibuatOleh] = useState('');

  useEffect(() => {
    // Fetch detail tugas
    fetch(`http://localhost:8000/api/tugas/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Tugas tidak ditemukan');
        return response.json();
      })
      .then((data) => {
        setTugas(data);

        // Fetch user untuk diberikan_kepada
        fetch(`http://localhost:8000/api/users/${data.diberikan_kepada}`)
          .then((response) => response.json())
          .then((user) => setDiberikanKepada(user.nama));

        // Fetch user untuk dibuat_oleh
        fetch(`http://localhost:8000/api/users/${data.dibuat_oleh}`)
          .then((response) => response.json())
          .then((user) => setDibuatOleh(user.nama));
      })
      .catch((error) => {
        setError('Terjadi kesalahan saat mengambil detail tugas.');
        console.error('Error:', error);
      });
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      {tugas ? (
        <CCard>
          <CCardHeader>
            <h5>Detail Tugas</h5>
          </CCardHeader>
          <CCardBody>
            <p><strong>Judul:</strong> {tugas.judul}</p>

            {/* Menampilkan Foto jika ada */}
            {tugas.foto_selesai ? (
              <div>
                <strong>Foto Selesai:</strong>
                <img
                  src={`http://localhost:8000/storage/${tugas.foto_selesai}`}
                  alt="Foto Selesai"
                  className="img-fluid mt-2"
                  style={{ maxWidth: '300px', height: 'auto' }}
                />
              </div>
            ) : (
              <p><strong>Foto Selesai:</strong> Belum tersedia</p>
            )}

            <p><strong>Deskripsi:</strong> {tugas.deskripsi || '-'}</p>
            <p><strong>Batas Waktu:</strong> {tugas.batas_waktu || '-'}</p>
            <p><strong>Status:</strong> {tugas.status}</p>
            <p><strong>Prioritas:</strong> {tugas.prioritas}</p>
            <p><strong>Diberikan Kepada:</strong> {tugas.penerima ? tugas.penerima.nama : 'Tidak diketahui'}</p>
            <p><strong>Dibuat Oleh:</strong> {tugas.pembuat ? tugas.pembuat.nama : 'Tidak diketahui'}</p>

          </CCardBody>
          <div className="d-flex justify-content-end p-3">
            <CButton color="secondary" onClick={() => window.history.back()}>
              Kembali
            </CButton>
          </div>
        </CCard>
      ) : (
        <p>Memuat...</p>
      )}
    </div>
  );
};

export default DetailTugas;
