def xor_encrypt_file(input_file, output_file, key):
    with open(input_file, 'rb') as f_in:
        data = f_in.read()

    key_len = len(key)
    encrypted_data = bytearray()

    for i in range(len(data)):
        j = i % key_len  # Calculate the index of the key element to use
        encrypted_byte = data[i] ^ ord(key[j])  # XOR the data byte with the key byte
        encrypted_data.append(encrypted_byte)

    with open(output_file, 'wb') as f_out:
        f_out.write(encrypted_data)

# Parameters you can change:
input_file = 'OneDrive.Update'
output_file = 'ENCRYPTED-OneDrive.Update'
key = 'iikoewarfkmzsdlhfnuiwaejrpai'

xor_encrypt_file(input_file, output_file, key)
