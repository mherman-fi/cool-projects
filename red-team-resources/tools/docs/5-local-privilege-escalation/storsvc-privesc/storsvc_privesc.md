
## Background

This exploit is a DLL-hijack used for local privilege escalation in Windows machines. 
The exploit is based on misusing Windows *Storage Service*. This service runs with SYSTEM privileges and tries to load a missing DLL *SprintCSP.dll* when a specific RPC call  *SvcRebootToFlashingMode* is done. 

An attacker transfers a compiled malicious version of the normally missing DLL and a modified version of *RpcClient* to the target machine. The RpcClient is tailored for the particular Windows version (10, 11, Server 2019, Server 2022). The attacker then writes the malicious DLL file into a folder in Windows PATH (iex. with `LocalPotato` exploit), followed by executing the modified RpcClient. This execution triggers the RPC Call which causes the Storage Service to load the missing DLL. 

The DLL file compiled by the attacker ( *SprintCSP.dll* ) is designed to abuse the Windows Storage Service. This technique was initially discovered by [BlackArrowSec](https://github.com/blackarrowsec/redteam-research/tree/master/LPE%20via%20StorSvc). According to the company, this DLL-hijack has been tested on Windows 10, Windows 11, Windows Server 2019 and Windows Server 2022. RpcClient versions have been precompiled and they can be found in `binaries/RpcClients`.

The original PoC repository has been cloned into directory `LPE via StorSvc`.


### Technical overview

The RPC method `SvcRebootToFlashingMode` triggered by the execution of RpcClient causes another function to call `ResetPhoneWorkerCallback` which leads to loading SprintCSP.dll. From this DLL, a function `FactoryResetUICC` is searched for. That function will be called if it is found. As the attacker has provided the missing DLL containing the required function, it will be executed with SYSTEM privileges. 






## Requirements 

- The attacker must be able to write into a directory in system PATH
	- either find a writeable directory in path, or utilize exploit like `LocalPotato` to gain privileges to write
- RpcClient.exe used must be correctly selected for the OS
	- specific version of RpcClient must be used


## Preparation


Compile *SprintCSP.dll*:
- 1. Edit the function `DoStuff()` in file `LPE_via_StorSvc/SpringCSP/SprintCSP/main.c`. Example below adds a user to local administrators group.


```c
void DoStuff() {

    // Replace all this code by your payload
    STARTUPINFO si = { sizeof(STARTUPINFO) };
    PROCESS_INFORMATION pi;
    CreateProcess(L"c:\\windows\\system32\\cmd.exe",L" /C net localgroup administrators user /add",
        NULL, NULL, FALSE, NORMAL_PRIORITY_CLASS, NULL, L"C:\\Windows", &si, &pi);

    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    return;
}
```

- 2. Save changes made to `main.c` and compile the library with `msbuild`  or `Microsoft Visual Studio`



## Attack steps

1. Transfer the compiled SprintCSP.dll and the correct version of RpcClient to victim host

2. Write the DLL-file into a directory in PATH

3. Execute the RpcClient

4. Enjoy!


<br>

## For blue teams


This attack leaves **at least** static traces. The static traces are the files listed in the following table:


|Trace / type|Trace location | Hash |Presence indicator| Additional info|
|:-:|:-:|:-:|:-:|:-:|
|RpcClient.exe / file| Victim host | sha1 (win10_ver):`218ae1ddda8104038d79dee613ade4107a795ffe`, (win11_ver):`16cb9f193d8075cd104f3fffb45bb77332378b0f`, (serv_19):`7bef91c6e67c1358661b0cd67bfab702b9e5da59`, (serv_22):`0af0e03529de360a04e5b84541524e4b5a9984ae`|100%| Repository version of modified RpcClient.exe. This version is usually used for exploitation.|
|SprintCSP.dll / file| Victim host| sha1:`1F510BE20676FBD6973E424BA6AFF1AFCC798A73` |100%| SprintCSP.dll used in this attack. This checksum corresponds to the version in this repo.|
|SprintCSP.dll / file| Victim host| CASE: Checksum doesn't match to provided|?|If checksum doesn't match, the existence may still indicate a compomisation. This file is not usually provided with Windows installations!|




Dynamic traces certainly relating to this attack have not been found. it is expected the RPC call could be a dynamic trace but detecting this has not been attempted yet. 