from __future__ import annotations

import sys
from unittest import mock

# Populate sys.modules with mocks for all problematic dependencies before importing
mock_modules = [
    "scrapy",
    "scrapy.commands",
    "scrapy.exceptions",
    "scrapy.spiderloader",
    "scrapy.utils",
    "scrapy.utils.template",
]

for mod_name in mock_modules:
    sys.modules[mod_name] = mock.MagicMock()

from scrapy.commands.genspider import (
    extract_domain,
    sanitize_module_name,
    verify_url_scheme,
)

import pytest

@pytest.mark.parametrize(
    ("url", "expected"),
    [
        ("example.com", "https://example.com"),
        ("example.com/path", "https://example.com/path"),
        ("http://example.com", "http://example.com"),
        ("https://example.com", "https://example.com"),
        ("ftp://example.com", "ftp://example.com"),
        ("//example.com", "//example.com"),
    ],
)
def test_verify_url_scheme(url: str, expected: str) -> None:
    assert verify_url_scheme(url) == expected


@pytest.mark.parametrize(
    ("url", "expected"),
    [
        ("http://example.com", "example.com"),
        ("https://example.com/path", "example.com"),
        ("example.com", "example.com"),
        ("example.com/path", "example.com"),
        ("//example.com/path", "example.com"),
    ],
)
def test_extract_domain(url: str, expected: str) -> None:
    assert extract_domain(url) == expected


@pytest.mark.parametrize(
    ("name", "expected"),
    [
        ("myspider", "myspider"),
        ("my-spider", "my_spider"),
        ("my.spider", "my_spider"),
        ("1spider", "a1spider"),
        ("_spider", "a_spider"),
        (".spider", "a_spider"),
    ],
)
def test_sanitize_module_name(name: str, expected: str) -> None:
    assert sanitize_module_name(name) == expected
