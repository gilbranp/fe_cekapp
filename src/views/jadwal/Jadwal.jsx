/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput } from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import '@coreui/coreui/dist/css/coreui.min.css';

const Jadwal = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State untuk konfirmasi hapus
    const [eventToDelete, setEventToDelete] = useState(null);

    // Fetch events from API
    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/acara');
            const eventsData = response.data;

            const updatedEvents = {};
            eventsData.forEach(event => {
                const dateKey = new Date(event.tanggal_acara).toLocaleDateString('id-ID');
                if (!updatedEvents[dateKey]) {
                    updatedEvents[dateKey] = [];
                }
                updatedEvents[dateKey].push({ id: event.id, title: event.judul });
            });

            setEvents(updatedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAddOrEditEvent = async () => {
        if (!eventTitle.trim()) {
            toast.error('Judul acara tidak boleh kosong');
            return;
        }

        const dateKey = selectedDate.toLocaleDateString('en-CA');

        try {
            if (editingEvent) {
                // Edit existing event
                await axios.put(`http://localhost:8000/api/acara/${editingEvent.id}`, {
                    judul: eventTitle,
                    tanggal_acara: dateKey,
                });
                toast.success('Acara berhasil diperbarui');
            } else {
                // Add new event
                await axios.post('http://localhost:8000/api/acara', {
                    judul: eventTitle,
                    tanggal_acara: dateKey,
                });
                toast.success('Acara berhasil ditambahkan');
            }
            setEventTitle('');
            setModalVisible(false);
            setEditingEvent(null);
            await fetchEvents(); // Refresh events
        } catch (error) {
            toast.error(`Gagal menambah/memperbarui acara: ${error.response?.data?.message || error.message}`);
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            if (eventToDelete) {
                await axios.delete(`http://localhost:8000/api/acara/${eventToDelete.id}`);
                toast.success('Acara berhasil dihapus');
                setShowDeleteConfirmation(false);
                setEventToDelete(null);
                await fetchEvents();
            }
        } catch (error) {
            toast.error(`Gagal menghapus acara: ${error.response?.data?.message || error.message}`);
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    const confirmDeleteEvent = (event) => {
        setEventToDelete(event);
        setShowDeleteConfirmation(true);
    };

    const renderEvents = () => {
        const dateKey = selectedDate.toLocaleDateString('id-ID');
        const dayEvents = events[dateKey] || [];

        return (
            <ul className="list-group mt-3">
                {dayEvents.length > 0 ? (
                    dayEvents.map((event, index) => (
                        <li key={index} style={styles.listItem}>
                            {event.title}
                            <div style={styles.buttonContainer}>
                                <CButton color="warning" size="sm" style={styles.editButton}
                                    onClick={() => {
                                        setEditingEvent(event);
                                        setEventTitle(event.title);
                                        setModalVisible(true);
                                    }}>
                                    Edit
                                </CButton>
                                <CButton color="danger" size="sm" style={styles.deleteButton}
                                    onClick={() => confirmDeleteEvent(event)}>
                                    Hapus
                                </CButton>
                            </div>
                        </li>
                    ))
                ) : (
                    <li style={{ color: '#9CA3AF' }}>Tidak ada acara</li>
                )}
            </ul>
        );
    };

    const getFormattedDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', locale: 'id-ID' };
        return new Intl.DateTimeFormat('id-ID', options).format(date);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Pengelolaan Jadwal Keluarga</h2>

            <div style={styles.row}>
                <div style={styles.col}>
                    <div style={styles.calendarContainer}>
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileClassName={({ date, view }) => {
                                const dateKey = date.toLocaleDateString('id-ID');
                                return view === 'month' && events[dateKey] ? 'highlight' : null;
                            }}
                            className="custom-calendar"
                        />
                    </div>
                    <CButton style={styles.addButton} onClick={() => {
                        setEventTitle('');
                        setEditingEvent(null);
                        setModalVisible(true);
                    }}>
                        Tambah Acara
                    </CButton>
                </div>

                <div style={styles.col}>
                    <h4 style={styles.subTitle}>
                        Acara pada Tanggal: {getFormattedDate(selectedDate)}
                    </h4>
                    {renderEvents()}
                </div>
            </div>

            {/* Modal Tambah/Edit Acara */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader style={styles.modalHeader} closeButton>{editingEvent ? 'Edit Acara' : 'Tambah Acara'}</CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Judul Acara"
                        placeholder="Contoh: Ulang Tahun, Liburan, dll."
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Batal
                    </CButton>
                    <CButton color="primary" onClick={handleAddOrEditEvent}>
                        {editingEvent ? 'Perbarui' : 'Tambah'}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Konfirmasi Hapus */}
            <CModal visible={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <CModalHeader closeButton>Konfirmasi Hapus</CModalHeader>
                <CModalBody>Apakah Anda yakin ingin menghapus acara ini?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                        Batal
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteEvent}>
                        Hapus
                    </CButton>
                </CModalFooter>
            </CModal>

            <ToastContainer />
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#1E293B',
        minHeight: '100vh',
        overflowX: 'auto',
    },
    title: {
        color: '#E2E8F0',
        marginBottom: '20px',
        textAlign: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    col: {
        padding: '10px',
        minWidth: '300px',
    },
    calendarContainer: {
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '10px',
        boxSizing: 'border-box',
    },
    addButton: {
        backgroundColor: '#10b981',
        color: 'white',
        borderRadius: '8px',
        fontWeight: 'bold',
        marginTop: '20px',
        padding: '10px 20px',
        width: '100%',
    },
    subTitle: {
        color: '#E2E8F0',
        textAlign: 'center',
    },
    listItem: {
        padding: '10px',
        backgroundColor: '#4B5563',
        color: '#E2E8F0',
        fontWeight: 'bold',
        borderRadius: '8px',
        margin: '5px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
    },
    editButton: {
        backgroundColor: '#F59E0B',
        color: 'white',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        color: 'white',
    },
    modalHeader: {
        backgroundColor: '#3B82F6',
        color: 'white',
    },
};


// Tambahkan CSS untuk tema dan responsive calendar
const calendarStyle = `
  .custom-calendar {
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #334155;
    color: #E2E8F0;
    width: 100%;
    margin: 0 auto;
  }
  .react-calendar__tile--now {
    background: #2563EB;
    color: white;
  }
  .react-calendar__tile--active {
    background: #10B981 !important;
    color: white !important;
  }
  .react-calendar__tile--active:enabled:hover {
    background: #059669 !important;
  }
  .react-calendar__tile--hasActive {
    background: #4B5563;
  }
  .highlight {
    background: #6EE7B7;
    color: #1E293B;
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    .custom-calendar {
      font-size: 12px;
    }
  }

  @media (max-width: 576px) {
    .custom-calendar {
      font-size: 10px;
    }
  }

  @media (max-width: 320px) {
    .custom-calendar {
      font-size: 8px;
      padding: 5px;
    }
  }
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = calendarStyle;
document.head.appendChild(styleElement);

export default Jadwal;
