export default function Message({ message }) {
    return (
        <div className={`message ${message.role}`}>
            {message.image_url && <img src={message.image_url} alt="uploaded" style={{ maxWidth: 200 }} />}
            <p>{message.text}</p>
        </div>
    );
}
