interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Checkbox(props: Props) {
    return (
        <div className="form-control">
            <label className="label cursor-pointer gap-2">
                <span className="label-text">{props.label}</span>
                <input {...props} type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
            </label>
        </div>
    );
}
