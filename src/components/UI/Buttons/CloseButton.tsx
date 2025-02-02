interface Props {
    onClose: () => void;
}

export default function CloseButton(props: Props) {
    return (
        <button type="button" className="btn btn-xs btn-circle btn-ghost" onClick={props.onClose}>
            ✕
        </button>
    );
}
