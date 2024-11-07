/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Anggota() {
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        nama: '',
        username: '',
        role: '',
        nama_keluarga: ''
    });

    useEffect(() => {
        // Fungsi untuk mengambil data dari backend
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/users'); // Sesuaikan URL backend Anda
                if (!response.ok) throw new Error('Gagal mengambil data');
                const data = await response.json();
                setUsers(data); // Data diambil dari API dan disimpan ke state `users`
            } catch (error) {
                console.error('Error:', error);
                toast.error('Gagal mengambil data pengguna'); // Notifikasi error pengambilan data
            }
        };

        fetchData();
    }, []);

    const handleEdit = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Gagal menghapus data');

                // Menghapus data di frontend setelah sukses menghapus di backend
                setUsers(users.filter((user) => user.id !== userId));
                toast.success('Data berhasil dihapus'); // Notifikasi berhasil dihapus
            } catch (error) {
                console.error('Error:', error);
                toast.error('Gagal menghapus data'); // Notifikasi error
            }
        }
    };

    const handleUpdate = async (updatedUser) => {
        // Validasi input sebelum update
        if (!updatedUser.nama || !updatedUser.username || !updatedUser.role || !updatedUser.nama_keluarga) {
            toast.error('Semua field harus diisi');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/users/${updatedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) throw new Error('Gagal mengupdate data');

            setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
            setIsEditing(false);
            setCurrentUser({ nama: '', username: '', role: '', nama_keluarga: '' });
            toast.success('Data berhasil diupdate'); // Notifikasi berhasil diupdate
        } catch (error) {
            console.error('Error:', error);
            toast.error('Terjadi kesalahan saat mengupdate data'); // Notifikasi error
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-primary">Manajemen Pengguna</h2>
            
            {/* User List Table */}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Nama Keluarga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.nama}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>{user.nama_keluarga}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">Data belum ada</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal untuk Edit User */}
            {isEditing && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit User</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsEditing(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdate(currentUser);
                                    }}
                                >
                                    <div className="mb-3">
                                        <label className="form-label">Nama</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={currentUser.nama}
                                            onChange={(e) =>
                                                setCurrentUser({ ...currentUser, nama: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={currentUser.username}
                                            onChange={(e) =>
                                                setCurrentUser({ ...currentUser, username: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            value={currentUser.role}
                                            onChange={(e) =>
                                                setCurrentUser({ ...currentUser, role: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">Pilih Role</option>
                                            <option value="Administrator">Administrator</option>
                                            <option value="Orangtua">Orangtua</option>
                                            <option value="Anak">Anak</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nama Keluarga</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={currentUser.nama_keluarga}
                                            onChange={(e) =>
                                                setCurrentUser({ ...currentUser, nama_keluarga: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Simpan</button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-2"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Batal
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
}

export default Anggota;
