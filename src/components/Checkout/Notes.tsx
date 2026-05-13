import { useTranslations } from "next-intl";

type NotesFieldProps = {
  value: string;
  onChange: (val: string) => void;
};

const Notes = ({ value, onChange }: NotesFieldProps) => {
  const t = useTranslations("Checkout");
  
  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
      <label htmlFor="notes" className="block mb-2.5">
        {t("notes.label")}
      </label>

      <textarea
        id="notes"
        name="notes"
        rows={5}
        placeholder={t("notes.placeholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-3 bg-gray-1 p-5 
      placeholder:text-dark-5 outline-none duration-200 
      focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
      />
    </div>
  );
};

export default Notes;
