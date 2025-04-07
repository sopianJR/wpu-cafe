import styles from './Select.module.css';

interface Proptypes {
  label: string;
  name: string;
  id: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

const Select = (props: Proptypes) => {
  const { label, name, id, required = false, options } = props;
  return (
    <label htmlFor={id} className={styles.label}>
      {label}
      <select id={id} className={styles.select} name={name} required={required}>
        {options.map((option: { value: string; label: string }) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Select;
