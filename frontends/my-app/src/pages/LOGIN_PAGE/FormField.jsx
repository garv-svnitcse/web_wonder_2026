export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  onBlur,
  autoComplete,
  state,
  message,
  trailing,
}) {
  const cls = [
    "field",
    state === "error" ? "error" : "",
    state === "ok" ? "ok" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      <div className="field-inner">
        <span className="field-icon">{icon}</span>
        <div className="field-text">
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete={autoComplete}
          />
        </div>
        {trailing && <div className="field-trail">{trailing}</div>}
      </div>
      {message !== undefined && <div className="field-msg">{message}</div>}
    </div>
  );
}
