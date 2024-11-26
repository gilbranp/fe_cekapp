/* eslint-disable prettier/prettier */
import React from "react";

const LandingPage = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="bg-gradient text-white text-center py-5">
        <div className="container">
          <h1 className="display-3 fw-bold animate__animated animate__fadeInDown">
            Cerdas Efisiensi Keluarga
          </h1>
          <p className="lead animate__animated animate__fadeInUp">
            Solusi modern untuk mengelola aktivitas keluarga dengan efisien.
          </p>
          <a
            href="#features"
            className="btn btn-lg btn-outline-light rounded-pill px-4 py-2 mt-3 animate__animated animate__pulse animate__infinite"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5 text-primary">
            Fitur Unggulan Kami
          </h2>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="card feature-card border-0 shadow-lg transform-hover">
                <div className="card-body">
                  <div className="feature-icon mb-4">
                    <i className="bi bi-person-circle text-primary"></i>
                  </div>
                  <h5 className="card-title">Manajemen Pengguna</h5>
                  <p className="card-text">
                    Atur akses untuk orangtua, anak, dan anggota keluarga lainnya.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card feature-card border-0 shadow-lg transform-hover">
                <div className="card-body">
                  <div className="feature-icon mb-4">
                    <i className="bi bi-calendar-check text-primary"></i>
                  </div>
                  <h5 className="card-title">Jadwal Keluarga</h5>
                  <p className="card-text">
                    Kalender keluarga untuk mengatur aktivitas bersama.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card feature-card border-0 shadow-lg transform-hover">
                <div className="card-body">
                  <div className="feature-icon mb-4">
                    <i className="bi bi-wallet2 text-primary"></i>
                  </div>
                  <h5 className="card-title">Pengelolaan Keuangan</h5>
                  <p className="card-text">
                    Pantau pengeluaran dan pendapatan keluarga dengan mudah.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* Call to Action Section */}
          <section className="bg-gradient-light text-dark py-5 position-relative overflow-hidden">
        <div className="container text-center position-relative">
          <h2 className="fw-bold display-5 mb-4 animate__animated animate__fadeInDown">
            Bergabung dengan <span className="text-primary">CEK</span> Sekarang!
          </h2>
          <p className="mb-4 lead animate__animated animate__fadeInUp">
            Dapatkan kemudahan dalam mengelola aktivitas keluarga Anda dengan solusi cerdas kami.
          </p>
          <a
            href="#/register"
            className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg animate__animated animate__pulse animate__infinite"
          >
            Daftar Sekarang
          </a>

          {/* Background Decorative Element */}
          <div className="cta-bg-circle position-absolute"></div>
        </div>

        {/* Floating Decorative Icons */}
        <div className="floating-icons">
          <i className="bi bi-heart-fill text-primary floating-icon icon-1"></i>
          <i className="bi bi-calendar-check-fill text-success floating-icon icon-2"></i>
          <i className="bi bi-wallet2 text-warning floating-icon icon-3"></i>
        </div>
      </section>

      {/* Custom CSS */}
      <style jsx>{`
        .bg-gradient-light {
          background: linear-gradient(135deg, #e0f7fa, #ffffff);
        }
        .cta-bg-circle {
          width: 500px;
          height: 500px;
          background: rgba(0, 123, 255, 0.1);
          border-radius: 50%;
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          z-index: -1;
        }
        .floating-icons {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          pointer-events: none;
        }
        .floating-icon {
          position: absolute;
          font-size: 2rem;
          animation: float 4s ease-in-out infinite;
          opacity: 0.8;
        }
        .icon-1 {
          top: 30%;
          left: 20%;
          animation-delay: 0s;
        }
        .icon-2 {
          top: 50%;
          left: 70%;
          animation-delay: 1s;
        }
        .icon-3 {
          top: 70%;
          left: 40%;
          animation-delay: 2s;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>


      {/* Footer Section */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">© 2024 CEK App. Semua Hak Dilindungi.</p>
        </div>
      </footer>

      {/* Custom CSS */}
      <style jsx>{`
        .bg-gradient {
          background: linear-gradient(to right, #4facfe, #00f2fe);
        }
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
        }
        .feature-icon {
          font-size: 3rem;
          color: #00f2fe;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
