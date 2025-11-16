export default function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div style={{
      background: "#d4edda",
      color: "#155724",
      padding: "10px",
      borderRadius: "6px",
      marginBottom: "15px",
      border: "1px solid #c3e6cb"
    }}>
      {message}
    </div>
  );
}
