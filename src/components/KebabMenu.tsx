import { useState } from "react";

const KebabMenu = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => {
    const [open, setOpen] = useState(false);

    return(
        <div className="relative">
            < button 
                onClick={() => setOpen(!open)}
                arial-label = "Menu"
                style={{ padding: '4px',
                borderRadius: '50%',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px'}}
                >
         <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          <div style={{
            width: '4px',
            height: '4px',
            backgroundColor: '#6B7280',
            borderRadius: '50%'
          }}></div>
          <div style={{
            width: '4px',
            height: '4px',
            backgroundColor: '#6B7280',
            borderRadius: '50%'
          }}></div>
          <div style={{
            width: '4px',
            height: '4px',
            backgroundColor: '#6B7280',
            borderRadius: '50%'
          }}></div>
        </div>
        </button>
        {/* Menu dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          right: '0',
          top: '100%',
          marginTop: '8px',
          width: '128px',
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: '10'
        }}>
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#374151',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            Editar
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#EF4444',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            Excluir
          </button>
        </div>
      )}


        </div>
    );
};
export default KebabMenu;