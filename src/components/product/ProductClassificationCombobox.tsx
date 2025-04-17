interface ProductClassificationComboboxProps {
  onSelect: (classification: { id: string; name: string }) => void
  placeholder: string
}

const ProductClassificationCombobox = ({ onSelect, placeholder }: ProductClassificationComboboxProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectProduct = (classification: { id: string; name: string }) => {
    onSelect(classification)
    placeholder.toString()
  }
  return <div>ProductClassificationCombobox</div>
}

export default ProductClassificationCombobox
