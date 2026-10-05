import os
from datetime import datetime

from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "hafta1-gelistirme-anahtari-degistir")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///kampus_panosu.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


@app.context_processor
def ortak_sablon_verileri():
    """Menüde rol bilgisi gerektiğinde giriş yapan kişiyi şablona verir."""
    return {"giris_yapmis_kullanici": giris_yapmis_kullanici()}


class Kullanici(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ad_soyad = db.Column(db.String(80), nullable=False)
    eposta = db.Column(db.String(120), unique=True, nullable=False)
    sifre = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default="kullanici")
    oneriler = db.relationship("Oneri", backref="sahip", lazy=True)


class Oneri(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    baslik = db.Column(db.String(120), nullable=False)
    aciklama = db.Column(db.Text, nullable=False)
    durum = db.Column(db.String(20), nullable=False, default="Yeni")
    olusturma_tarihi = db.Column(db.DateTime, default=datetime.utcnow)
    kullanici_id = db.Column(db.Integer, db.ForeignKey("kullanici.id"), nullable=False)


def giris_yapmis_kullanici():
    """Oturum açan kişiyi veritabanından getirir."""
    if "kullanici_id" not in session:
        return None
    return db.session.get(Kullanici, session["kullanici_id"])


def super_admin_gerekli():
    """Admin sayfalarında kullanılacak basit rol kontrolü."""
    kullanici = giris_yapmis_kullanici()
    if not kullanici or kullanici.rol != "super_admin":
        flash("Bu sayfaya yalnızca süper admin erişebilir.", "danger")
        return None
    return kullanici


@app.route("/")
def anasayfa():
    kullanici = giris_yapmis_kullanici()
    if kullanici:
        oneriler = Oneri.query.filter_by(kullanici_id=kullanici.id).order_by(Oneri.olusturma_tarihi.desc()).all()
    else:
        oneriler = []
    return render_template("index.html", kullanici=kullanici, oneriler=oneriler)


@app.route("/kayit", methods=["GET", "POST"])
def kayit():
    if request.method == "POST":
        ad_soyad = request.form.get("ad_soyad", "").strip()
        eposta = request.form.get("eposta", "").strip().lower()
        sifre = request.form.get("sifre", "")
        if not ad_soyad or not eposta or len(sifre) < 6:
            flash("Tüm alanları doldurun. Şifre en az 6 karakter olmalı.", "danger")
        elif Kullanici.query.filter_by(eposta=eposta).first():
            flash("Bu e-posta adresi zaten kayıtlı.", "danger")
        else:
            kullanici = Kullanici(ad_soyad=ad_soyad, eposta=eposta,
                                  sifre=generate_password_hash(sifre), rol="kullanici")
            db.session.add(kullanici)
            db.session.commit()
            session["kullanici_id"] = kullanici.id
            flash("Hesabınız oluşturuldu. Hoş geldiniz!", "success")
            return redirect(url_for("anasayfa"))
    return render_template("kayit.html")


@app.route("/giris", methods=["GET", "POST"])
def giris():
    if request.method == "POST":
        eposta = request.form.get("eposta", "").strip().lower()
        sifre = request.form.get("sifre", "")
        kullanici = Kullanici.query.filter_by(eposta=eposta).first()
        if kullanici and check_password_hash(kullanici.sifre, sifre):
            session.clear()
            session["kullanici_id"] = kullanici.id
            flash("Giriş başarılı.", "success")
            return redirect(url_for("admin_paneli") if kullanici.rol == "super_admin" else url_for("anasayfa"))
        flash("E-posta veya şifre hatalı.", "danger")
    return render_template("giris.html")


@app.route("/cikis")
def cikis():
    session.clear()
    flash("Oturum kapatıldı.", "info")
    return redirect(url_for("anasayfa"))


@app.route("/oneri-ekle", methods=["POST"])
def oneri_ekle():
    kullanici = giris_yapmis_kullanici()
    if not kullanici:
        flash("Öneri göndermek için giriş yapmalısınız.", "warning")
        return redirect(url_for("giris"))
    baslik = request.form.get("baslik", "").strip()
    aciklama = request.form.get("aciklama", "").strip()
    if not baslik or not aciklama:
        flash("Öneri başlığı ve açıklaması boş bırakılamaz.", "danger")
    else:
        db.session.add(Oneri(baslik=baslik, aciklama=aciklama, kullanici_id=kullanici.id))
        db.session.commit()
        flash("Öneriniz panoya eklendi.", "success")
    return redirect(url_for("anasayfa"))


@app.route("/admin")
def admin_paneli():
    if not super_admin_gerekli():
        return redirect(url_for("giris"))
    oneriler = Oneri.query.order_by(Oneri.olusturma_tarihi.desc()).all()
    kullanici_sayisi = Kullanici.query.count()
    return render_template("admin.html", oneriler=oneriler, kullanici_sayisi=kullanici_sayisi)


@app.route("/admin/oneri/<int:oneri_id>/durum", methods=["POST"])
def oneri_durum_degistir(oneri_id):
    if not super_admin_gerekli():
        return redirect(url_for("giris"))
    oneri = db.get_or_404(Oneri, oneri_id)
    yeni_durum = request.form.get("durum")
    if yeni_durum in ["Yeni", "İnceleniyor", "Tamamlandı"]:
        oneri.durum = yeni_durum
        db.session.commit()
        flash("Öneri durumu güncellendi.", "success")
    else:
        flash("Seçilen durum geçerli değil.", "danger")
    return redirect(url_for("admin_paneli"))


with app.app_context():
    db.create_all()
    # İlk çalıştırmada yalnızca bir kez örnek süper admin oluşturulur.
    if not Kullanici.query.filter_by(eposta="admin@kampus.local").first():
        admin = Kullanici(
            ad_soyad="Proje Yöneticisi",
            eposta="admin@kampus.local",
            sifre=generate_password_hash("Admin123!"),
            rol="super_admin",
        )
        db.session.add(admin)
        db.session.commit()


if __name__ == "__main__":
    app.run(debug=True)
