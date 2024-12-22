import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import './Signature.css'; // Import the CSS file

const fontStyles = [
  { name: 'Playwrite AU QLD Italic', cssClass: 'playwrite-au-qld' },
  { name: 'Playwrite AT Guides Italic', cssClass: 'playwrite-at-guides-italic' },
  { name: 'Playwrite AR', cssClass: 'playwrite-ar' },
  { name: 'Cursive', cssClass: 'cursive' }, // Add any additional custom CSS class as needed
];

const fontSizes = ['16px', '18px', '20px', '24px'];
const fontColors = ['#000000', '#FF5733', '#28A745', '#007BFF'];

interface SignaturePickerProps {
  onSignatureSelect: (signature: { text: string; font: string; size: string; color: string }) => void;
}

const SignaturePicker: React.FC<SignaturePickerProps> = ({ onSignatureSelect }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [useCurrentUserName, setUseCurrentUserName] = useState(true);
  const [customName, setCustomName] = useState('');
  const [selectedFont, setSelectedFont] = useState(fontStyles[0]);
  const [selectedSize, setSelectedSize] = useState(fontSizes[0]);
  const [selectedColor, setSelectedColor] = useState(fontColors[0]);

  const signatureText = useCurrentUserName ? currentUser?.name || '' : customName;

  const handleSignatureChange = () => {
    onSignatureSelect({
      text: signatureText,
      font: selectedFont.cssClass,
      size: selectedSize,
      color: selectedColor,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Your Signature</h2>

      {/* Toggle between current user name and custom signature */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="signatureOption"
            checked={useCurrentUserName}
            onChange={() => {
              setUseCurrentUserName(true);
              handleSignatureChange();
            }}
            className="mr-2"
          />
          Use Current User Name
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="signatureOption"
            checked={!useCurrentUserName}
            onChange={() => {
              setUseCurrentUserName(false);
              handleSignatureChange();
            }}
            className="mr-2"
          />
          Custom Signature
        </label>
      </div>

      {/* Input field for custom signature */}
      {!useCurrentUserName && (
        <input
          type="text"
          className="w-full border rounded-md p-2 mb-4"
          placeholder="Type your custom signature here..."
          value={customName}
          onChange={(e) => {
            setCustomName(e.target.value);
            handleSignatureChange();
          }}
        />
      )}

      {/* Preview of the signature */}
      <div
        className={`border p-4 rounded-md mb-4 ${selectedFont.cssClass}`}
        style={{ fontSize: selectedSize, color: selectedColor }}
      >
        {signatureText || 'Your Signature Preview'}
      </div>

      {/* Font Styles */}
      <h3 className="mb-2">Font Styles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fontStyles.map((style) => (
          <div
            key={style.name}
            className={`border p-2 cursor-pointer ${
              selectedFont.cssClass === style.cssClass ? 'border-green-500' : 'border-gray-300'
            }`}
            onClick={() => {
              setSelectedFont(style);
              handleSignatureChange();
            }}
          >
            <p className={style.cssClass}>{signatureText || 'Your Name'}</p>
          </div>
        ))}
      </div>

      {/* Font Sizes */}
      <h3 className="mt-4">Font Size</h3>
      <div className="flex space-x-4">
        {fontSizes.map((size) => (
          <button
            key={size}
            className={`p-2 rounded ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => {
              setSelectedSize(size);
              handleSignatureChange();
            }}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Font Colors */}
      <h3 className="mt-4">Font Color</h3>
      <div className="flex space-x-4">
        {fontColors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: color }}
            onClick={() => {
              setSelectedColor(color);
              handleSignatureChange();
            }}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default SignaturePicker;
