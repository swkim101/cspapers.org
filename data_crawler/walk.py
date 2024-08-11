#!/usr/bin/python

import os

# traverse root directory, and list directories as dirs and files as files
for root, dirs, files in os.walk("data"):
   for file in files:
      if file.endswith("."):
         old = os.path.join(root, file)
         new = os.path.join(root, file.rstrip("."))
         if os.path.exists(new):
            os.remove(old)
         else:
            os.rename(old, new)