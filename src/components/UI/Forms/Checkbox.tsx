interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Checkbox(props: Props) {
    return (
        <label className="fieldset-label">
            <span className="label-text">{props.label}</span>
            <input {...props} type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
        </label>
    );
}
