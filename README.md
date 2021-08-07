# changeexe
Change the icon and versioninfo of executable files. Fast. Easy.

# installation

`npm install changeexe`
 
# usage
 
```javascript
const changeExe = require('changeexe');
```

**change icon**

```javascript
(async () => { 
    await changeExe.icon('program.exe', 'icon.ico');
})();
```

**change versioninfo**

```javascript
(async () => {
  await changeExe.versionInfo('program.exe', {
    CompanyName: 'Legit Tax Haven, LLC',
    FileDescription: 'An innocent file that will not harm your computer. Double-click to read more.',
    FileVersion: '1.3.3.7',
    LegalCopyright: 'Copyright 2021, all my rights are belong to me.',
    OriginalFilename: 'virus.exe',
    ProductName: 'Not A Virus',
    ProductVersion: '1.2.3.4'
  });
})();
```

**both**

```javascript
(async () => {
  await changeExe.icon('program.exe', 'picture.png');
  await changeExe.versionInfo('program.exe', {
    CompanyName: 'Legit Tax Haven, LLC',
    FileDescription: 'An innocent file that will not harm your computer. Double-click to read more.',
    FileVersion: '1.3.3.7',
    LegalCopyright: 'Copyright 2021, all my rights are belong to me.',
    OriginalFilename: 'virus.exe',
    ProductName: 'Not A Virus',
    ProductVersion: '1.2.3.4'
  });
})();