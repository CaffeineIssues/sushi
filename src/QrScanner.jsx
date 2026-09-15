import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, ImagePlus, QrCode } from "lucide-react";
export function QrScanner({ onDetect }) {
  const video = useRef(null),
    stream = useRef(null),
    timer = useRef(null),
    mounted = useRef(true);
  const [active, setActive] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const stop = () => {
    clearInterval(timer.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      stop();
    };
  }, []);
  function read(canvas) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return jsQR(data.data, data.width, data.height)?.data;
  }
  function accept(text) {
    const message = onDetect(text);
    if (message) {
      setError(message);
      return false;
    }
    stop();
    return true;
  }
  async function start() {
    setError("");
    setBusy(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      const source = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      if (!mounted.current) {
        source.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = source;
      video.current.srcObject = source;
      await video.current.play();
      if (!mounted.current) return;
      setActive(true);
      const canvas = document.createElement("canvas");
      timer.current = setInterval(() => {
        const v = video.current;
        if (!v || v.readyState < 2) return;
        canvas.width = 640;
        canvas.height = Math.round((v.videoHeight / v.videoWidth) * 640);
        canvas.getContext("2d").drawImage(v, 0, 0, canvas.width, canvas.height);
        const text = read(canvas);
        if (text) accept(text);
      }, 300);
    } catch (e) {
      stop();
      if (mounted.current) {
        setActive(false);
        setError(
          e.name === "NotAllowedError"
            ? "Permita o acesso à câmera no navegador ou escolha uma foto do QR code."
            : "Não foi possível abrir a câmera. Use uma conexão HTTPS ou escolha uma foto do QR code.",
        );
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas
        .getContext("2d")
        .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const text = read(canvas);
      if (!mounted.current) return;
      if (text) accept(text);
      else
        setError(
          "Não encontramos um QR code nesta imagem. Tente uma foto mais nítida.",
        );
    } catch {
      if (mounted.current)
        setError(
          "Não foi possível ler a imagem. Escolha uma foto em PNG ou JPG.",
        );
    }
    e.target.value = "";
  }
  return (
    <div className="modal-padding scanner">
      <div className="modal-icon">
        <QrCode />
      </div>
      <h2>Escaneie. Peça. Aproveite.</h2>
      <p>
        Aponte a câmera para o QR code da sua mesa. Identificamos a mesa
        automaticamente para você.
      </p>
      <div className={"scanner-frame " + (active ? "is-active" : "")}>
        <video
          ref={video}
          playsInline
          muted
          aria-label="Câmera para leitura do QR code"
        />
        {!active && <QrCode size={88} strokeWidth={1} />}
        <span className="scanner-corners" />
      </div>
      {error && (
        <p className="scan-error" role="alert">
          {error}
        </p>
      )}
      {!active && (
        <button className="primary full" onClick={start} disabled={busy}>
          <Camera size={18} />
          {busy ? "Abrindo câmera…" : "Ativar câmera"}
        </button>
      )}
      {active && <p className="scan-hint">Procurando o QR code da mesa…</p>}
      <label className="scan-upload">
        <ImagePlus size={17} />
        Escolher foto do QR code
        <input type="file" accept="image/*" onChange={upload} />
      </label>
      <p className="scan-hint">
        Você também pode usar a câmera do seu celular para abrir o link do QR
        code diretamente.
      </p>
    </div>
  );
}
