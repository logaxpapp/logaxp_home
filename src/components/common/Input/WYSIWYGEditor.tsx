import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface WYSIWYGEditorProps {
  value?: string;
  onChange?: (content: string) => void;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ value, onChange }) => {
  const handleEditorChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Editor
      apiKey="od64v42wuabpgiqpil89kulpo1p905j53wjd0gkkc5ixo0mr"
      value={value}
      onEditorChange={handleEditorChange}
      init={{
        height: 500,
        menubar: true, // Enable the menubar for more options
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
          'textcolor colorpicker hr emoticons codesample',
          'spellchecker visualblocks quickbars',
        ],
        toolbar:
          'undo redo | formatselect | fontsizeselect | fontselect | forecolor backcolor | bold italic underline strikethrough | \
           alignleft aligncenter alignright alignjustify | bullist numlist | link image media | \
           codesample blockquote hr | table emoticons | fullscreen preview code | help',
        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt', // Define font size options
        font_formats:
          'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times; Courier New=courier new,courier; Verdana=verdana,geneva;',
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        quickbars_insert_toolbar: false,
        contextmenu: 'link image inserttable | cell row column deletetable',
        branding: false, // Removes "Powered by TinyMCE" branding
      }}
    />
  );
};

export default WYSIWYGEditor;
