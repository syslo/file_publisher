from setuptools import setup


setup(
    name='file_publisher',
    version='0.0.dev0',
    author='Marián Horňák',
    author_email='marian.sysel.hornak@gmail.com',
    description=(
        'Django app for managing and publishing files in a tree structure.'
    ),
    license='MIT',
    keywords='django file publish',
    packages=[
        'file_publisher',
        'file_publisher.urls',
        'file_publisher.migrations',
        'file_publisher.views',
    ],
    install_requires=[
       'Django>=1.9',
       'djangorestframework>=3.3',
    ]
)
