export default function SimpleInput({ label, ...props }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label>{label}</label><br />
      <input {...props} style={{ padding: 6, width: "100%" }} />
    </div>
  );
}
