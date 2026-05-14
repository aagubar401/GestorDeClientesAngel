import { useEffect, useRef, useState } from "react";
import useHandleUserCard from "./hooks/useHandleUserCard.js";

const UserCard = ({ onUserUpdated }) => {
  const {
    fields: {
      user,
      error,
      modifyMode,
      consultMode,
      setName,
      message,
      name,
      setModifyMode,
      setConsultMode,
      refreshUser,
      pendingAvatar,
      setPendingAvatar,
    },
    handleSubmit,
    handleDeleteAvatar,
  } = useHandleUserCard();

  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const triggerFileSelect = () => fileInputRef.current?.click();

  const notifyParent = async () => {
    await refreshUser();
    onUserUpdated?.();
  };

  // 🔵 Crear y limpiar URL de preview
  useEffect(() => {
    if (
      pendingAvatar &&
      pendingAvatar !== "DELETE" &&
      pendingAvatar instanceof File
    ) {
      const url = URL.createObjectURL(pendingAvatar);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }

    setPreviewUrl(null);
  }, [pendingAvatar]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded shadow">{error}</div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-gray-100 text-gray-700 rounded shadow">
        Cargando datos del usuario...
      </div>
    );
  }

  // Avatar a mostrar: preview > borrado > avatar real > inicial
  const avatarToShow =
    pendingAvatar === "DELETE"
      ? null
      : previewUrl
        ? previewUrl
        : user.avatar
          ? `${import.meta.env.VITE_API_URL_AVATAR}${user.avatar}`
          : null;

  return (
    <div className="w-full bg-white p-8 rounded-xl shadow border border-gray-300 h-full overflow-auto">
      {/* Avatar + Nombre */}
      <div className="flex flex-col items-center mb-6">
        {/* AVATAR */}
        <div className="relative group w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-4xl font-bold shadow overflow-hidden">
          {avatarToShow ? (
            <img
              src={avatarToShow}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{user.name.charAt(0).toUpperCase()}</span>
          )}

          {/* OVERLAY con iconos */}
          {modifyMode && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
              {/* SUBIR */}
              <button
                onClick={triggerFileSelect}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                title="Subir avatar"
              >
                ↑
              </button>

              {/* ELIMINAR */}
              {(user.avatar || pendingAvatar) && (
                <button
                  onClick={() => setPendingAvatar("DELETE")}
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition"
                  title="Eliminar avatar"
                >
                  X
                </button>
              )}
            </div>
          )}

          {/* Input oculto */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPendingAvatar(file);
              }
            }}
          />
        </div>

        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Datos */}
      <div className="space-y-3 text-gray-800">
        <p>
          <span className="font-semibold">Rol:</span> {user.role}
        </p>

        <p>
          <span className="font-semibold">Estado:</span>{" "}
          {user.active ? (
            <span className="text-green-600 font-semibold">Activo</span>
          ) : (
            <span className="text-red-600 font-semibold">Inactivo</span>
          )}
        </p>

        {modifyMode && (
          <>
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded mb-1">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 bg-green-100 text-green-800 rounded mb-1">
                {message}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                await handleSubmit(e);

                // limpiar input file
                if (fileInputRef.current) fileInputRef.current.value = "";

                notifyParent();
              }}
              className="space-y-4 mt-2"
            >
              <p className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-20">
                  Nombre:
                </span>

                <input
                  className="input flex-1 w-full"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Introduce tu nuevo nombre"
                  required
                />
              </p>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Guardar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPendingAvatar(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setModifyMode(false);
                    setConsultMode(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Botón Editar */}
      {consultMode && (
        <div className="flex justify-end mt-10">
          <button
            onClick={() => {
              setName(user.name);
              setModifyMode(true);
              setConsultMode(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
